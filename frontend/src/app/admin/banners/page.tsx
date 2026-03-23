"use client";

import {
  useGetBannersQuery,
  useAddBannerMutation,
  useDeleteBannerMutation,
  useUpdateBannerMutation,
  BannerSlot,
  Banner,
} from "@/redux/api/bannerApi";
import { RootState, server } from "@/redux/store";
import { responseToast } from "@/utils/features";
import { ChangeEvent, useRef, useState } from "react";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/admin/Loader";

// ── Slot config ──────────────────────────────────────────
const SLOTS: { key: BannerSlot; label: string; description: string }[] = [
  {
    key: "hero",
    label: "Hero Banners",
    description: "Main carousel at the top of the home page. Multiple banners supported.",
  },
  {
    key: "promo",
    label: "Promo Banner",
    description: "Single wide banner between categories and latest products.",
  },
  {
    key: "bottom",
    label: "Bottom Banner",
    description: "Single banner below latest products, above features row.",
  },
];

// ── Banner Card ──────────────────────────────────────────
const BannerCard = ({
  banner,
  userId,
  slot,
}: {
  banner: Banner;
  userId: string;
  slot: BannerSlot;
}) => {
  const router = useRouter();
  const [deleteBanner] = useDeleteBannerMutation();
  const [updateBanner] = useUpdateBannerMutation();
  const fileRef = useRef<HTMLInputElement>(null);

  const imgSrc = banner.image.startsWith("http")
    ? banner.image
    : `${server}/${banner.image}`;

  const deleteHandler = async () => {
    const confirmed = window.confirm("Delete this banner?");
    if (!confirmed) return;
    const res = await deleteBanner({ bannerId: banner._id, userId });
    responseToast(res, router, "/admin/banners");
  };

  const updateHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("slot", slot);

    const res = await updateBanner({
      formData,
      userId,
      bannerId: banner._id,
    });
    responseToast(res, router, "/admin/banners");
  };

  return (
    <div className="banner-card">
      <img src={imgSrc} alt={`${slot} banner`} />
      <div className="banner-card-actions">
        <button
          className="banner-edit-btn"
          onClick={() => fileRef.current?.click()}
          title="Replace image"
        >
          <FaEdit />
        </button>
        <button
          className="banner-delete-btn"
          onClick={deleteHandler}
          title="Delete banner"
        >
          <FaTrash />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={updateHandler}
        />
      </div>
    </div>
  );
};

// ── Upload Form ──────────────────────────────────────────
const UploadForm = ({
  slot,
  userId,
}: {
  slot: BannerSlot;
  userId: string;
}) => {
  const router = useRouter();
  const [addBanner, { isLoading }] = useAddBannerMutation();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const fileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const submitHandler = async () => {
    if (!file) return toast.error("Please select an image");

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("slot", slot);

    const res = await addBanner({ formData, userId });
    responseToast(res, router, "/admin/banners");
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="banner-upload-form">
      {preview && (
        <div className="banner-upload-preview">
          <img src={preview} alt="Preview" />
        </div>
      )}
      <label className="banner-upload-label">
        <FaPlus />
        <span>{file ? file.name : "Choose Image"}</span>
        <input
          type="file"
          accept="image/*"
          onChange={fileChangeHandler}
          style={{ display: "none" }}
        />
      </label>
      {file && (
        <button
          className="banner-upload-btn"
          onClick={submitHandler}
          disabled={isLoading}
        >
          {isLoading ? "Uploading..." : "Upload Banner"}
        </button>
      )}
    </div>
  );
};

// ── Slot Section ─────────────────────────────────────────
const SlotSection = ({
  slotKey,
  label,
  description,
  userId,
}: {
  slotKey: BannerSlot;
  label: string;
  description: string;
  userId: string;
}) => {
  const { data, isLoading } = useGetBannersQuery(slotKey);

  return (
    <section className="banner-slot-section">
      <div className="banner-slot-header">
        <div>
          <h2>{label}</h2>
          <p>{description}</p>
        </div>
        <span className="banner-count">
          {data?.banners.length ?? 0} banner{data?.banners.length !== 1 ? "s" : ""}
        </span>
      </div>

      {isLoading ? (
        <Skeleton length={2} />
      ) : (
        <div className="banner-slot-grid">
          {data?.banners.map((b) => (
            <BannerCard key={b._id} banner={b} userId={userId} slot={slotKey} />
          ))}
          <UploadForm slot={slotKey} userId={userId} />
        </div>
      )}
    </section>
  );
};

// ── Main Page ─────────────────────────────────────────────
const BannerManagement = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  if (!user?._id) return <p>Unauthorized</p>;

  return (
    <main className="banner-management">
      <h1>Banner Management</h1>

      {SLOTS.map((s) => (
        <SlotSection
          key={s.key}
          slotKey={s.key}
          label={s.label}
          description={s.description}
          userId={user._id}
        />
      ))}
    </main>
  );
};

export default BannerManagement;