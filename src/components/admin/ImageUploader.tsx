import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { uploadFile, publicUrl } from "@/lib/storage";

export function ImageUploader({ value, onChange, label = "Image" }: { value?: string; onChange: (url: string) => void; label?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const handle = async (file: File) => {
    setBusy(true);
    try {
      const url = await uploadFile(file);
      onChange(url);
      toast.success("Uploaded");
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally { setBusy(false); }
  };
  return (
    <div>
      <label className="text-sm font-medium block mb-1">{label}</label>
      <div className="flex gap-2 items-start">
        {value && <img src={publicUrl(value)} alt="" className="h-20 w-20 object-cover rounded border" />}
        <div className="flex-1 space-y-2">
          <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="Image URL or upload" className="w-full px-3 py-2 border rounded text-sm" />
          <div className="flex gap-2">
            <button type="button" onClick={() => ref.current?.click()} className="px-3 py-1.5 bg-muted hover:bg-muted/70 rounded text-sm flex items-center gap-1.5">
              <Upload className="h-3.5 w-3.5" /> {busy ? "Uploading..." : "Upload"}
            </button>
            {value && <button type="button" onClick={() => onChange("")} className="px-3 py-1.5 bg-muted rounded text-sm flex items-center gap-1.5"><X className="h-3.5 w-3.5" /> Clear</button>}
          </div>
        </div>
      </div>
      <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && handle(e.target.files[0])} />
    </div>
  );
}
