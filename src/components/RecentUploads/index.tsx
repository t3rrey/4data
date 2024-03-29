import { useEffect, useState } from "react";
import useEffectOnce from "@/lib/hooks/useEffectOnce";
import { supabase } from "@/lib/database/supabase";
import { RecentUpload } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import LoadingIcon from "../LoadingIcon";

// Define the interface for RecentUploadJoined which extends RecentUpload
export interface RecentUploadJoined extends RecentUpload {
  super_funds: {
    id: string;
    name: string;
  };
}

// Define the RecentUploads component
export const RecentUploads = () => {
  // Define state variables
  const [recentUploads, setRecentUploads] = useState<RecentUploadJoined[]>([]);
  const [selectedUpload, setSelectedUpload] =
    useState<RecentUploadJoined | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch recent uploads from the database
  const fetchRecentUploads = async () => {
    const { data, error } = await supabase
      .from("recent_uploads")
      .select(`*, super_funds(id, name)`);
    if (error) {
      console.log(error);
      return;
    }

    setRecentUploads(data as RecentUploadJoined[]);
    setLoading(true);
  };

  // Fetch recent uploads when the component mounts
  useEffectOnce(() => {
    fetchRecentUploads();
  });

  // Handle delete action for an upload
  const handleDelete = (upload: RecentUploadJoined) => {
    setSelectedUpload(upload);
    setModalOpen(true);
  };

  useEffect(() => {
    // Subscribe to the custom-delete-channel for changes in recent_uploads table
    const recentUploads = supabase
      .channel("custom-delete-channel")
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "recent_uploads" },
        (payload) => {}
      )
      .subscribe();
    fetchRecentUploads();
  }, [recentUploads]);

  if (!loading) {
    return (
      <div className="flex w-full mt-56">
        <div className="w-40 mx-auto">
          <LoadingIcon className="text-black" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-semibold leading-7 text-gray-900">
              Recent Uploads
            </h1>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Fund Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Upload Date
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Current As Of
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Rows Added
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {recentUploads.map((upload, idx) => (
                      <tr key={idx}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {upload.super_funds.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatTimestamp(upload.created_at || "")}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {upload.current_as_of}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {upload.rows_added}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            className="text-white bg-red-500 p-2 rounded-md"
                            onClick={() => handleDelete(upload)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDeleteModal
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        selectedUpload={selectedUpload}
      />
    </>
  );
};

export default RecentUploads;
