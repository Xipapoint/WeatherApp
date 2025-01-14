import React, { memo } from "react";
import Image, { Props as ImageProps } from '../../Image/Image'
import UserInfo, { Props as UserProps } from '../../UserInfo/UserInfo'
type Props = ImageProps & UserProps
import styles from './userInfoModal.module.scss'
const UserInfoModal: React.FC<Props> = ({ ...props }) => {
  return (
    <div className={styles.modalUser}>
        <Image
            {...props as ImageProps}
        />
        <UserInfo
            {...props as UserProps}
            variant="modal"            
        />
    </div>
  );
};

export default memo(UserInfoModal);
