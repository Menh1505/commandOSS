import { CreateBattleResponse, CreatedObject } from '@/types/nodeResponse.type';
import { useSignTransaction } from '@mysten/dapp-kit';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import type { WalletAccount } from '@mysten/wallet-standard';
import { SuiGraphQLClient } from '@mysten/sui/graphql';

/**
 * Class cung cấp các phương thức tương tác với Sui blockchain
 */
export class SuiService {
    private client: SuiClient;
    private network: 'mainnet' | 'testnet' | 'devnet' | 'localnet';
    private graphqlClient: SuiGraphQLClient;

    constructor(network: 'mainnet' | 'testnet' | 'devnet' | 'localnet' = 'testnet') {
        this.network = network;
        this.client = new SuiClient({ url: getFullnodeUrl("testnet") });
        this.graphqlClient = new SuiGraphQLClient({
            url: `https://sui-${network}.mystenlabs.com/graphql`,
        });
    }

    formatObjectId(id: string, addPrefix: boolean = false): string {
        if (addPrefix) {
            return id.startsWith('0x') ? id : `0x${id}`;
        } else {
            return id.startsWith('0x') ? id.substring(2) : id;
        }
    }

    async createBattle(
        signTransaction: ReturnType<typeof useSignTransaction>['mutateAsync'],
        currentAccount: WalletAccount,
    ): Promise<string | undefined> {
        if (!currentAccount?.address) {
            alert("Connect wallet before calling contract");
            return;
        }

        try {
            const tx = new Transaction();
            tx.setSender(currentAccount.address);
            tx.moveCall({
                package: "0x8e20bbd2df64f0a09826d77c1697166a97c786fba31ef13bf15e06ab5acf36e0",
                module: "scontract",
                function: "start_battle",
                arguments: [],
                typeArguments: []
            });

            const { bytes, signature, reportTransactionEffects } = await signTransaction({
                transaction: tx,
                chain: `sui:${this.network}`,
            });

            const executeResult = await this.client.executeTransactionBlock({
                transactionBlock: bytes,
                signature,
                options: {
                    showObjectChanges: true,
                },
            }) as unknown as CreateBattleResponse;

            reportTransactionEffects(executeResult.digest);
            return this.getCreateBattleResponseId(executeResult);
        } catch (error) {
            console.error("Error when calling contract:", error);
        }
    }

    getCreateBattleResponse(response: CreateBattleResponse): CreatedObject | undefined {
        return response.objectChanges.find(
            (change): change is CreatedObject =>
                change.type === 'created' &&
                change.objectType.includes('::scontract::BattleState')
        );
    }

    getMutatedBattleResponse(response: CreateBattleResponse): CreatedObject | undefined {
        return response.objectChanges.find(
            (change): change is CreatedObject =>
                change.type === 'mutated' &&
                change.objectType.includes('::scontract::BattleState')
        );
    }


    getCreateBattleResponseId(response: CreateBattleResponse): string | undefined {
        const battleState = this.getCreateBattleResponse(response);
        return battleState?.objectId;
    }

    async getBattleState(battleId: string) {
        const formattedId = this.formatObjectId(battleId, false);
        console.log("Fetching battle state for ID:", formattedId);
        try {
            const result = await this.client.getObject({
                id: formattedId,
                options: {
                    showContent: true,
                    showType: true,
                    showOwner: true,
                },
            });
            console.log("Battle state result:", result);
            if (!result.data || result.data.content?.dataType !== "moveObject") {
                throw new Error("Invalid object data");
            }

            const fields = result.data.content.fields;
            return fields;
        } catch (err) {
            console.error("❌ Error when fetching object:", err);
            return null;
        }
    }

    async attack(
        battleId: string,
        signTransaction: ReturnType<typeof useSignTransaction>['mutateAsync']
    ) {
        if (!battleId) {
            alert("Battle ID is required");
            return;
        }
        const formattedId = this.formatObjectId(battleId, false);
        try {
            const tx = new Transaction();
            tx.moveCall({
                package: "0x8e20bbd2df64f0a09826d77c1697166a97c786fba31ef13bf15e06ab5acf36e0",
                module: "scontract",
                function: "player_attack",
                arguments: [
                    tx.object(formattedId),
                    tx.object("0x8")
                ],
                typeArguments: []
            });

            const { bytes, signature, reportTransactionEffects } = await signTransaction({
                transaction: tx,
                chain: `sui:${this.network}`,
            });

            const executeResult = await this.client.executeTransactionBlock({
                transactionBlock: bytes,
                signature,
                options: {
                    showObjectChanges: true,
                },
            }) as unknown as CreateBattleResponse;

            reportTransactionEffects(executeResult.digest);
            return executeResult.digest;
        } catch (error) {
            console.error("Error when calling contract:", error);
        }
    }
    async createPvpBattle(
        signTransaction: ReturnType<typeof useSignTransaction>['mutateAsync'],
        currentAccount: WalletAccount,
    ): Promise<string | undefined> {
        if (!currentAccount?.address) {
            alert("Connect wallet before calling contract");
            return;
        }

        try {
            const tx = new Transaction();
            tx.setSender(currentAccount.address);
            tx.moveCall({
                package: "0x8e20bbd2df64f0a09826d77c1697166a97c786fba31ef13bf15e06ab5acf36e0",
                module: "pvp",
                function: "create_pvp",
                arguments: [],
                typeArguments: []
            });

            const { bytes, signature, reportTransactionEffects } = await signTransaction({
                transaction: tx,
                chain: `sui:${this.network}`,
            });

            const executeResult = await this.client.executeTransactionBlock({
                transactionBlock: bytes,
                signature,
                options: {
                    showObjectChanges: true,
                },
            }) as unknown as CreateBattleResponse;

            reportTransactionEffects(executeResult.digest);
            return this.getCreateBattleResponseId(executeResult);
        } catch (error) {
            console.error("Error when calling contract:", error);
        }
    }

    async joinPvpBattle(
        battleId: string,
        signTransaction: ReturnType<typeof useSignTransaction>['mutateAsync'],
        currentAccount: WalletAccount,
    ): Promise<string | undefined> {
        if (!currentAccount?.address) {
            alert("Connect wallet before calling contract");
            return;
        }

        if (!battleId) {
            alert("Battle ID is required");
            return;
        }

        const formattedId = this.formatObjectId(battleId, false);
        try {
            const tx = new Transaction();
            tx.setSender(currentAccount.address);
            tx.moveCall({
                package: "0x8e20bbd2df64f0a09826d77c1697166a97c786fba31ef13bf15e06ab5acf36e0",
                module: "pvp",
                function: "join_pvp",
                arguments: [tx.object(formattedId)],
                typeArguments: []
            });

            const { bytes, signature, reportTransactionEffects } = await signTransaction({
                transaction: tx,
                chain: `sui:${this.network}`,
            });

            const executeResult = await this.client.executeTransactionBlock({
                transactionBlock: bytes,
                signature,
                options: {
                    showObjectChanges: true,
                },
            }) as unknown as CreateBattleResponse;

            reportTransactionEffects(executeResult.digest);
            return this.getCreateBattleResponseId(executeResult);
        } catch (error) {
            console.error("Error when calling contract:", error);
        }
    }
    async PvpAttack(
        battleId: string,
        signTransaction: ReturnType<typeof useSignTransaction>['mutateAsync']
    ) {
        if (!battleId) {
            alert("Battle ID is required");
            return;
        }
        const formattedId = this.formatObjectId(battleId, false);
        try {
            const tx = new Transaction();
            tx.moveCall({
                package: "0x8e20bbd2df64f0a09826d77c1697166a97c786fba31ef13bf15e06ab5acf36e0",
                module: "pvp",
                function: "attach_pvp",
                arguments: [
                    tx.object(formattedId),
                    tx.object("0x8")
                ],
                typeArguments: []
            });

            const { bytes, signature, reportTransactionEffects } = await signTransaction({
                transaction: tx,
                chain: `sui:${this.network}`,
            });

            const executeResult = await this.client.executeTransactionBlock({
                transactionBlock: bytes,
                signature,
                options: {
                    showObjectChanges: true,
                },
            }) as unknown as CreateBattleResponse;

            reportTransactionEffects(executeResult.digest);
            return executeResult.digest;
        } catch (error) {
            console.error("Error when calling contract:", error);
        }
    }
}

// Export default instance với testnet
const suiService = new SuiService('testnet');
export default suiService;

