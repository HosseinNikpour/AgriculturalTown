export const columns = [
    //  { dataIndex: 'createor',key: 'createor', title: 'createor' }, 
    //  { dataIndex: 'editor',key: 'editor', title: 'editor' }, 
    // { dataIndex: 'edit_date',key: 'edit_date', title: 'edit_date' }, 
    { dataIndex: 'id', key: 'id', title: 'شناسه' },
    { dataIndex: 'entity_name', key: 'entity_name', title: 'عنوان سند' },
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
    // {key:'BaseInfo', value: 'BaseInfo', label: 'اطلاعات پایه' },
// {key:'company', value: 'Company', label: 'شناسنامه شرکت ها' },
// {key:'1', value: 'شناسنامه شهرکها', label: 'شناسنامه شهرکها' },
// {key:'2', value: 'شناسنامه قرارداد', label: 'شناسنامه قرارداد' },
// {key:'3', value: 'شناسنامه پروژه', label: 'شناسنامه پروژه' },
{key:'weeklyOperation', value: 'weeklyOperation', label: 'گزارش هفتگی عملیات اجرایی' },
{key:'weeklyWeather', value: 'weeklyWeather', label: 'گزارش هفتگی وضعیت جوی' },
{key:'weeklyUser', value: 'weeklyUser', label: 'گزارش هفتگی نیروی انسانی' },
{key:'weeklyMachine', value: 'weeklyMachine', label: 'گزارش هفتگی ماشین آلات' },
    // { value: 6, label: 'اطلاعات پایه' },
    // { value: 7, label: 'اطلاعات پایه' },
    // { value: 8, label: 'اطلاعات پایه' },
    // { value: 9, label: 'اطلاعات پایه' },
    // { value: 10, label: 'اطلاعات پایه' },
    // { value: 11, label: 'اطلاعات پایه' },
    // { value: 12, label: 'اطلاعات پایه' },
]