
export const columns = [
    { dataIndex: 'id',key: 'id', title: 'شناسه' }, 
    { dataIndex: 'contract',key: 'contract', title: 'قرارداد' }, 
    { dataIndex: 'period',key: 'period', title: 'دوره' }, 
   
];
export const storeIndex = "weeklyWeather";
export const pageHeder = 'گزارش هفتگی وضعیت جوی';

export const emptyItem = {
    operation_id : '', contract_id : '' ,unit_id : '' ,value : '' ,value_change : '' ,value_diff : '' ,price : '' ,price_change : '' ,price_diff : '' ,wieght : '' ,sort:'' 
};