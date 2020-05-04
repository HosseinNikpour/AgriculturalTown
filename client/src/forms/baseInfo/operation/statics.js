
export const columns = [
    // { dataIndex: 'creator_id',key: 'creator_id', title: 'creator_id' },
    //  { dataIndex: 'editor_id',key: 'editor_id', title: 'editor_id' }, 
    //  { dataIndex: 'edit_date',key: 'edit_date', title: 'edit_date' }, 
    //  { dataIndex: 'create_date',key: 'create_date', title: 'create_date' }, 
    //  { dataIndex: 'current_user_id',key: 'current_user_id', title: 'current_user_id' }, 
    //  { dataIndex: 'status',key: 'status', title: 'status' }, 
    { dataIndex: 'id',key: 'id', title: 'شناسه ' }, 
    { dataIndex: 'title',key: 'title', title: 'عنوان' },
    { dataIndex: 'unit',key: 'unit', title: 'واحد' }, 
    { dataIndex: 'sort',key: 'sort', title: 'ترتیب' }, 
    { dataIndex: 'category',key: 'category', title: 'گروه' }

];

export const storeIndex = "Operation";
export const pageHeder = 'عملیات اجرایی';

export const emptyItem = { title : '' ,unit_id:'',sort : '' ,category_id : ''  };