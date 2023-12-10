declare function fetchOnChainGraphData(address: string): [];

declare function transformData(inputData: [], limit: number, scoringMutiplier: number): { nodes: [], links: [] };

declare function calculatingScore(user: any, weightsMap: any): any[];

declare function createAddressMap(inputData: []): Map<string, any>;

