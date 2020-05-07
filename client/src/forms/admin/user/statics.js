
export const columns = [
    { sorter: true, key: 'id', dataIndex: 'id', title: 'شناسه' ,width:'70px',},
    { sorter: true, key: 'username', dataIndex: 'username', title: 'نام کاربری' },
    { sorter: true, key: 'name', dataIndex: 'name', title: 'نام' },
    { sorter: true, key: 'enabled', dataIndex: 'enabled', title: 'فعال؟', render: function (text, record, index) { return text ? 'بلی' : 'خیر' } },
    { sorter: true, key: 'last_login', dataIndex: 'last_login', title: 'آخرین اتصال', render: function (text) { return text?text.format('jYYYY/jMM/jDD HH:mm'):'' } },
    // { sorter: true, key: 'created_on', dataIndex: 'created_on', title: 'تاریخ ایجاد', type: 'date' },

];

export const roles = [ { key: 'admin', label: 'ادمین', value: 'admin' },
                        { key: 'manager', label: 'مدیر استان', value: 'manager' },
                        { key: 'engineer', label: 'مشاور', value: 'engineer' },
                        { key: 'contractor', label: 'پیمانکار', value: 'contractor' }]
export const storeIndex = "User";
export const pageHeder = 'اطلاعات کاربران';

export const emptyItem = { username: '', name: '', last_login: '', role: '', password: '', enabled: true };

export const genPass = (len) => {
    len = len ? len : 8;
    let string = "abcdefghijklmnopqrstuvwxyz";
    let stringU = "abcdefghijklmnopqrstuvwxyz".toUpperCase();
    let numeric = '0123456789';
    let punctuation = '!@#$%';

    let entity = [string, stringU, numeric, punctuation];
    let password = [];

    for (let i = 0; i < len; i++) {
        let x = Math.floor(Math.random() * 4);
        password.push(entity[x][Math.ceil(entity[x].length * Math.random() * Math.random())]);
    }
    return password.join('').toString();

}

export const checkForEN = (inputtxt) => {
    var letters = /^[a-z.]+$/;
    if (inputtxt.value.match(letters))
        return true;
    return false;
}