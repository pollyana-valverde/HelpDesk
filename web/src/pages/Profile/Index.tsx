import { useAuth } from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { ProfileModal } from "./ProfileModal";
import { ChangePasswordModal } from "./ChangePasswordModal";

export function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileModalOpen, setProfileModalOpen] = useState(true);
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] =
    useState(false);

  function handleOpenChangePassword() {
    setProfileModalOpen(false);
    setChangePasswordModalOpen(true);
  }

  function handleCloseModals() {
    setProfileModalOpen(false);
    setChangePasswordModalOpen(false);
  }

  function handlePasswordChanged() {
    if (
      confirm(
        "Senha alterada com sucesso! Você será deslogado para efetuar um novo login.",
      )
    ) {
      logout();
    }
    handleCloseModals();
  }

  function handleUserInfoChanged() {
    if (
      confirm(
        "Perfil alterado com sucesso! Você será deslogado para efetuar um novo login.",
      )
    ) {
      logout();
    }
    handleCloseModals();
  }

  function handleDeleteAccount() {
    if (
      confirm(
        "Conta deletada com sucesso! Você será deslogado.",
      )
    ) {
      logout();
    }
    handleCloseModals();
  }

  useEffect(() => {
    if (!isProfileModalOpen && !isChangePasswordModalOpen) {
      navigate(-1);
    }
  }, [isProfileModalOpen, isChangePasswordModalOpen, navigate]);

  return (
    <>
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={handleCloseModals}
        onOpenChangePassword={handleOpenChangePassword}
        onUserInfoChange={handleUserInfoChanged}
        onDeleteAccount={handleDeleteAccount}
      />
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={handleCloseModals}
        onPasswordChanged={handlePasswordChanged}
        openProfileModal={() => {
          setChangePasswordModalOpen(false);
          setProfileModalOpen(true);
        }}
      />
    </>
  );
}
