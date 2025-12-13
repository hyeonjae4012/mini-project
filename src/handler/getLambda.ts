interface UserData {
  id: string;
  name: string;
  age: number;
  orders: Order[];
}

interface Order {
  orderId: string;
  amount: number;
  items: string[];
}

interface ProcessedData {
  userId: string;
  totalAmount: number;
  averageOrderValue: number;
  topItems: string[];
}

export const handler = async (event: any) => {
  try {
    // Step 1: イベントデータの取得と初期検証
    console.log('Step 1: Fetching event data...');
    const userData = await fetchUserData(event);
    
    // Step 2: ユーザーデータの変換
    console.log('Step 2: Transforming user data...');
    const transformedData = transformUserData(userData);
    
    // Step 3: データの検証と集計
    console.log('Step 3: Validating and aggregating data...');
    const aggregatedData = aggregateOrderData(transformedData);
    
    // Step 4: 統計情報の計算
    console.log('Step 4: Calculating statistics...');
    const statistics = calculateStatistics(aggregatedData);
    
    // Step 5: 結果の整形
    console.log('Step 5: Formatting results...');
    const formattedResult = formatResult(statistics);
    
    return {
      statusCode: 200,
      body: JSON.stringify(formattedResult)
    };
  } catch (error) {
    console.error('Error occurred:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

/**
 * イベントからユーザーデータを取得
 */
async function fetchUserData(event: any): Promise<UserData> {
  const userId = event.pathParameters?.userId || 'user123';
  
  // 模擬的なユーザーデータの生成
  const mockData: UserData = {
    id: userId,
    name: 'John Doe',
    age: 30,
    orders: generateMockOrders()
  };
  
  // 非同期処理をシミュレート
  await sleep(100);
  
  return mockData;
}

/**
 * 模擬的な注文データを生成
 */
function generateMockOrders(): Order[] {
  return [
    { orderId: 'order1', amount: 1500, items: ['item1', 'item2'] },
    { orderId: 'order2', amount: 2500, items: ['item3', 'item4', 'item5'] },
    { orderId: 'order3', amount: 3200, items: ['item6'] },
    { orderId: 'order4', amount: 1800, items: ['item7', 'item8'] },
    { orderId: 'order5', amount: 4100, items: ['item9', 'item10', 'item11'] }
  ];
}

/**
 * ユーザーデータを変換
 */
function transformUserData(userData: UserData): UserData {
  // 複雑な変換処理をシミュレート
  const transformed = {
    ...userData,
    orders: userData.orders.map(order => ({
      ...order,
      amount: order.amount * 1.1, // 10%の税金を追加
      items: order.items.map(item => item.toUpperCase())
    }))
  };
  
  return transformed;
}

/**
 * 注文データを集計（ここでエラーが発生）
 */
function aggregateOrderData(userData: UserData): ProcessedData {
  // 複雑な計算処理
  const totalAmount = userData.orders.reduce((sum, order) => sum + order.amount, 0);
  
  // 全アイテムをフラット化
  const allItems = userData.orders.flatMap(order => order.items);
  
  // アイテムの出現回数をカウント
  const itemCounts = countItemOccurrences(allItems);
  
  // トップアイテムを取得（ここでエラーが発生する）
  const topItems = getTopItems(itemCounts, 5);
  
  // 平均注文額を計算
  const averageOrderValue = calculateAverageOrderValue(userData.orders);
  
  return {
    userId: userData.id,
    totalAmount,
    averageOrderValue,
    topItems
  };
}

/**
 * アイテムの出現回数をカウント
 */
function countItemOccurrences(items: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  
  for (const item of items) {
    const count = counts.get(item) || 0;
    counts.set(item, count + 1);
  }
  
  return counts;
}

/**
 * トップアイテムを取得（意図的なエラー箇所）
 */
function getTopItems(itemCounts: Map<string, number>, limit: number): string[] {
  // Map を配列に変換してソート
  const sortedItems = Array.from(itemCounts.entries())
    .sort((a, b) => b[1] - a[1]);
  
  // 複雑な処理を追加
  const processedItems = processItemList(sortedItems);
  
  // ★ エラー発生箇所：配列の範囲外アクセス
  // processedItems は空配列が返る可能性があり、
  // 後続の処理で undefined へのアクセスが発生
  const topItems = processedItems.slice(0, limit);
  
  // さらに変換処理
  return topItems.map(([item, count]) => {
    // ここで item が undefined の場合エラーが発生
    return item[0].toLowerCase() + item.slice(1);
  });
}

/**
 * アイテムリストを処理（エラーを引き起こす原因）
 */
function processItemList(items: [string, number][]): [string, number][] {
  // 複雑なフィルタリング処理
  const filtered = items.filter(([item, count]) => {
    // この条件によって、全てのアイテムが除外される可能性がある
    return count > 10 && item.length > 20;
  });
  
  // さらに変換
  const transformed = filtered.map(([item, count]) => {
    // 複雑な変換処理
    const processedItem = applyComplexTransformation(item);
    return [processedItem, count] as [string, number];
  });
  
  return transformed;
}

/**
 * 複雑な変換を適用
 */
function applyComplexTransformation(item: string): string {
  // 複数の変換を連鎖
  let result = item.trim();
  result = result.replace(/[^a-zA-Z0-9]/g, '_');
  result = result.toLowerCase();
  
  // 特殊な処理
  if (result.length > 10) {
    result = result.substring(0, 10);
  }
  
  return result;
}

/**
 * 平均注文額を計算
 */
function calculateAverageOrderValue(orders: Order[]): number {
  if (orders.length === 0) {
    return 0;
  }
  
  const total = orders.reduce((sum, order) => sum + order.amount, 0);
  return total / orders.length;
}

/**
 * 統計情報を計算
 */
function calculateStatistics(data: ProcessedData): any {
  return {
    ...data,
    formattedAmount: formatCurrency(data.totalAmount),
    formattedAverage: formatCurrency(data.averageOrderValue),
    itemCount: data.topItems.length
  };
}

/**
 * 金額をフォーマット
 */
function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * 結果を整形
 */
function formatResult(statistics: any): any {
  return {
    success: true,
    data: statistics,
    timestamp: new Date().toISOString()
  };
}

/**
 * スリープ用のユーティリティ関数
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
