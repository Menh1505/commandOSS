import { CreateBattleResponse, CreatedObject } from '@/types/nodeResponse.type';
import { useSignTransaction } from '@mysten/dapp-kit';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import type { WalletAccount } from '@mysten/wallet-standard';

/**
 * Class cung cấp các phương thức tương tác với Sui blockchain
 */
export class SuiService {
    private client: SuiClient;
    private network: 'mainnet' | 'testnet' | 'devnet' | 'localnet';

    constructor(network: 'mainnet' | 'testnet' | 'devnet' | 'localnet' = 'testnet') {
        this.network = network;
        this.client = new SuiClient({ url: getFullnodeUrl(network) });
    }

    /**
     * Gọi contract tạo battle, truyền các dependency cần thiết từ component sử dụng hook vào đây.
     */
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
                package: "0x41a69e2ef9f759dcd2d68135fd32169eddb4bd34a54b7ef194e7ba29a2505cf4",
                module: "scontract",
                function: "start_battle",
                arguments: [],
                typeArguments: []
            });

            const { bytes, signature, reportTransactionEffects } = await signTransaction({
                transaction: tx,
                chain: 'sui:testnet',
            });

            const executeResult = await this.client.executeTransactionBlock({
                transactionBlock: bytes,
                signature,
                options: {
                    showObjectChanges: true,
                },
            }) as unknown as CreateBattleResponse;

            reportTransactionEffects(executeResult.digest);
            return this.getBattleStateId(executeResult);
        } catch (error) {
            console.error("Error when calling contract:", error);
        }
    }

    getBattleState(response: CreateBattleResponse): CreatedObject | undefined {
        return response.objectChanges.find(
            (change): change is CreatedObject =>
                change.type === 'created' &&
                change.objectType.includes('::scontract::BattleState')
        );
    }

    getBattleStateId(response: CreateBattleResponse): string | undefined {
        const battleState = this.getBattleState(response);
        return battleState?.objectId;
    }

}

// Export default instance với testnet
const suiService = new SuiService('testnet');
export default suiService;

