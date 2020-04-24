
export const columns = [
    { sorter: true, key: 'id', dataIndex: 'id', title: 'شناسه' },
    { sorter: true, key: 'title', dataIndex: 'title', title: 'عنوان' },
    { sorter: true, key: 'full_title', dataIndex: 'full_title', title: 'نام کامل' },
    { sorter: true, key: 'town', dataIndex: 'town', title: 'شهرک' },

];

export const storeIndex = "project";
export const pageHeder = 'شناسنامه پروژه';

export const emptyItem = { title: '', full_title: '' ,town_id:''};