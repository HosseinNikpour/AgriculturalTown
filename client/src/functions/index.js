import { getItem } from '../api/index'

export const findNextStep = async (entityName, contractId, state, currentUserId) => {
  
    return await Promise.all([getItem(entityName, 'PermissionStructure'), getItem(contractId, 'contract')]).then(res => {
      
        let user_id = 0, role_id = 0;
        let approver = res[0].data[0].item_approver_id;
        let contract = res[1].data[0];

       
          if (state.toLowerCase() === 'a') {
            if (!currentUserId) role_id = approver[0];
            else {
                let currentRole=contract.contractor_user_id===currentUserId?1:
                                contract.engineer_user_id===currentUserId?2:
                                contract.manager_user_id===currentUserId?3:4;
                let i = approver.indexOf(currentRole);
                if (i > -1) {
                    if (approver[i + 1]) role_id = approver[i + 1];
                    else role_id = -1;
                }
            }
        }
        else  if (state.toLowerCase() === 'r'){
            let currentRole=contract.contractor_user_id===currentUserId?1:
            contract.engineer_user_id===currentUserId?2:
            contract.manager_user_id===currentUserId?3:4;
            let i = approver.indexOf(currentRole);
            if (approver[i - 1]) role_id = approver[i - 1];
            else role_id = 1;
        }

        switch (role_id) {
            case 1:
                user_id = contract.contractor_user_id;
                break;
            case 2:
                user_id = contract.engineer_user_id?contract.engineer_user_id:
                state.toLowerCase() === 'a'?contract.manager_user_id:contract.contractor_user_id;
                break;
            case 3:
                user_id = contract.manager_user_id;
                break;
            case 4:
                user_id = 1;
                break;
            case -1:
                user_id = -1;
                break;
        }
        return user_id;
    }).catch((error) => console.log(error));
}

