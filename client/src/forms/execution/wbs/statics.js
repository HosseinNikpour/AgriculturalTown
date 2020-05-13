
export const columns = [
    { dataIndex: 'contract',key: 'contract', title: 'پیمان' }, 
    { dataIndex: 'unit_id',key: 'unit_id', title: 'واحد' }, 
    { dataIndex: 'value',key: 'value', title: 'مقدار بر اساس قرارداد' }, 
    { dataIndex: 'value_change',key: 'value_change', title: 'مقدار بر اساس تغییرات مقادیر' }, 
    { dataIndex: 'value_diff',key: 'value_diff', title: 'حذف / اضافه' }, 
    { dataIndex: 'price',key: 'price', title: 'مبلغ اولیه' }, 
    { dataIndex: 'price_change',key: 'price_change', title: 'مبلغ بر اساس تغییر مقادیر' },
    { dataIndex: 'price_diff',key: 'price_diff', title: 'حذف / اضافه' }, 
    { dataIndex: 'wieght',key: 'wieght', title: 'درصد وزنی' },
];
export const storeIndex = "wbs";
export const pageHeder = 'ساختار شکست';

export const emptyItem = {
    operation_id : '' ,unit_id : '' ,value : '' ,value_change : '' ,value_diff : '' ,price : '' ,price_change : '' ,price_diff : '' ,wieght : '' ,sort:'' 
};