import { RecentUploadJoined } from "@/components/RecentUploads";
import { supabase } from "@/lib/database/supabase";
import { Dialog, Transition } from "@headlessui/react";
import { FC, Fragment } from "react";

//Define the props interface for Confirm
export interface IConfirmDeleteModal {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedUpload: RecentUploadJoined | null;
}

// Define the ConfirmDeleteModal component
const ConfirmDeleteModal: FC<IConfirmDeleteModal> = ({
  isOpen,
  setIsOpen,
  selectedUpload,
}) => {
  const closeModal = () => setIsOpen(false);

  // Handle the delete confirmation
  const handleConfirm = async () => {
    const { error: delete_from_data_error } = await supabase
      .from("data")
      .delete()
      .eq("recent_uploads", selectedUpload?.id);

    if (delete_from_data_error) {
      console.log(delete_from_data_error);
      return;
    }
    const { error: delete_from_recent_uploads_error } = await supabase
      .from("recent_uploads")
      .delete()
      .eq("id", selectedUpload?.id);

    if (delete_from_recent_uploads_error) {
      console.log(delete_from_recent_uploads_error);
      return;
    }

    closeModal();
  };
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Are you sure you want to delete this upload?
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      This will delete{" "}
                      <strong>{selectedUpload?.rows_added} </strong> rows for
                      the fund{" "}
                      <strong>{selectedUpload?.super_funds.name}</strong>
                    </p>
                  </div>

                  <div className="mt-4 justify-between w-full flex">
                    <button
                      type="button"
                      className="bg-red-500 p-2 rounded-md text-white font-semibold"
                      onClick={handleConfirm}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="bg-gray-400 p-2 rounded-md text-white font-semibold"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ConfirmDeleteModal;
