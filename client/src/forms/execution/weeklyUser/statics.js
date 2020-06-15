
export const columns = [
    { dataIndex: 'id',key: 'id', title: 'شناسه' }, 
    { dataIndex: 'contract',key: 'contract', title: 'پیمان' }, 
    { dataIndex: 'period',key: 'period', title: 'دوره' }, 
    { dataIndex: 'status',key: 'status', title: 'وضعیت' }, 
    { dataIndex: 'current_user',key: 'current_user', title: 'کاربر جاری' }, 
];
export const storeIndex = "weeklyUser";
export const pageHeder = 'گزارش هفتگی نیروی انسانی';

export const emptyItem = {
    operation_id : '', contract_id : '' ,unit_id : '' ,value : '' ,value_change : '' ,value_diff : '' ,price : '' ,price_change : '' ,price_diff : '' ,wieght : '' ,sort:'' 
};