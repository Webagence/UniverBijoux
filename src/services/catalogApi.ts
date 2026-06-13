import api from "./api";

export interface ImportedSelection {
  productId: string;
  reference: string;
  name: string;
  quantity: number;
  moq: number;
  pack_size: number;
  price_ht: number;
}

interface ImportResponse {
  selections: ImportedSelection[];
  count: number;
}

export const catalogApi = {
  downloadExcel: async () => {
    const response = await api.get("/catalog/export", {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    const disposition = response.headers["content-disposition"];
    const match = disposition?.match(/filename="?(.+?)"?$/);
    link.download = match?.[1] ?? "catalogue-francegems.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
  importExcel: async (file: File): Promise<ImportResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post("/catalog/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};
