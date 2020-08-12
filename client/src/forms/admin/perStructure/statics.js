export const columns = [
    //  { dataIndex: 'createor',key: 'createor', title: 'createor' }, 
    //  { dataIndex: 'editor',key: 'editor', title: 'editor' }, 
    // { dataIndex: 'edit_date',key: 'edit_date', title: 'edit_date' }, 
    { dataIndex: 'id', key: 'id', title: 'شناسه' },
    { dataIndex: 'entity_name_fa', key: 'entity_name_fa', title: 'عنوان سند' },
    { dataIndex: 'item_creator', key: 'item_creator', title: 'ایجاد کننده' },
    { dataIndex: 'item_approver', key: 'item_approver', title: 'تایید کننده' },
    { dataIndex: 'item_viewer', key: 'item_viewer', title: 'مشاهده کننده' },
    { dataIndex: 'item_editor', key: 'item_editor', title: 'ویرایش کننده' },
    // { dataIndex: 'create_date',key: 'create_date', title: 'create_date' },
];
export const storeIndex = "PermissionStructure";
export const pageHeder = 'دسترسی ها';

export const emptyItem = {
    entity_name: '', item_creator_id: '', item_approver_id: [], item_viewer_id: [], item_editor_id:[],
};
export const entities = [

{key:'weeklyOperation', value: 'weeklyOperation', label: 'گزارش هفتگی عملیات اجرایی' },
{key:'weeklyWeather', value: 'weeklyWeather', label: 'گزارش هفتگی وضعیت جوی' },
{key:'weeklyUser', value: 'weeklyUser', label: 'گزارش هفتگی نیروی انسانی' },
{key:'weeklyMachine', value: 'weeklyMachine', label: 'گزارش هفتگی ماشین آلات' },
{key:'invoiceContractorApprove', value: 'invoiceContractorApprove', label: 'تایید صورت وضعیت-کارفرما' },
{key:'invoiceContractor', value: 'invoiceContractor', label: 'صورت وضعیت پیمانکار' },
{key:'invoiceConsultant', value: 'invoiceConsultant', label: 'صورت حساب مشاور' },
{key:'invoiceContractorPay', value: 'invoiceContractorPay', label: 'پرداخت صورت وضعیت' },
{key:'invoiceConsultantApprove', value: 'invoiceConsultantApprove', label: 'صورتحساب-تایید کارفرما' },
{key:'invoiceConsultantPay', value: 'invoiceConsultantPay', label: 'پرداخت صورتحساب' },
{key:'creditPredict', value: 'creditPredict', label: 'پیش بینی اعتبار' },
{key:'tender', value: 'tender', label: 'مناقصه' },
{key:'tempDelivery', value: 'tempDelivery', label: 'تحویل موقت' },
{key:'delivery', value: 'delivery', label: 'تحویل قطعی' },
{key:'company', value: 'company', label: 'شناسنامه شرکتها' },
{key:'town', value: 'town', label: 'شناشنامه شهرکها' },
{key:'contract', value: 'contract', label: 'شناسنامه پیمان' },
{key:'agreement', value: 'agreement', label: 'شناسنامه قرارداد' },
{key:'valuechange', value: 'valuechange', label: 'تغییر مقادیر' },
{key:'extension', value: 'extension', label: 'تمدید مدت قرارداد' },
{key:'contractCycle', value: 'contractCycle', label: 'چرخه پیمان' },
{key:'projectCycle', value: 'projectCycle', label: 'چرخه قرارداد' },
{key:'insurance', value: 'insurance', label: 'بیمه' },
{key:'insuranceAppendix', value: 'insuranceAppendix', label: 'الحاقیه بیمه' },


]