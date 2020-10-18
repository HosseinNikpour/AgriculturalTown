
export const columns = [
    { dataIndex: 'id',key: 'id', title: 'شناسه' }, 
    { dataIndex: 'contract',key: 'contract', title: 'پیمان' }, 
    { dataIndex: 'plan',key: 'plan', title: 'شماره برنامه' }, 
   
];
export const storeIndex = "weeklyOperationPlan";
export const pageHeder = 'برنامه زمانبندی عملیات اجرایی';

export const emptyItem = {
    operation_id : '', contract_id : '' ,unit_id : '' ,value : '' ,value_change : '' ,value_diff : '' ,price : '' ,price_change : '' ,price_diff : '' ,wieght : '' ,sort:'' 
};