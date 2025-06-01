import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

/**
 * Class cung cấp các phương thức tương tác với Sui blockchain
 */
export class SuiService {
    private client: SuiClient;
    private network: 'mainnet' | 'testnet' | 'devnet' | 'localnet';
    private keypair: Ed25519Keypair | null = null;

    /**
     * Khởi tạo service với network chỉ định
     * @param network Mạng Sui (testnet, mainnet, devnet, localnet)
     */
    constructor(network: 'mainnet' | 'testnet' | 'devnet' | 'localnet' = 'testnet') {
        this.network = network;
        this.client = new SuiClient({ url: getFullnodeUrl(network) });
    }   

    
}

// Export default instance với testnet
const suiService = new SuiService('testnet');
export default suiService;

