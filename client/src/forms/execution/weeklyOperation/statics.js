
export const columns = [
    { dataIndex: 'id',key: 'id', title: 'شناسه' }, 
    { dataIndex: 'contract_no',key: 'contract_no', title: 'شماره قرارداد' }, 
    { dataIndex: 'company',key: 'company', title: 'طرف قرارداد' }, 
    { dataIndex: 'contract',key: 'contract', title: 'پیمان' }, 
    { dataIndex: 'period',key: 'period', title: 'دوره' }, 
    { dataIndex: 'status',key: 'status', title: 'وضعیت' }, 
    { dataIndex: 'current_user',key: 'current_user', title: 'کاربر جاری' }, 

];
export const storeIndex = "weeklyOperation";
export const pageHeder = 'گزارش هفتگی عملیات اجرایی';

export const emptyItem = {
    operation_id : '', contract_id : '' ,unit_id : '' ,value : '' ,value_change : '' ,value_diff : '' ,price : '' ,price_change : '' ,price_diff : '' ,wieght : '' ,sort:'' 
};