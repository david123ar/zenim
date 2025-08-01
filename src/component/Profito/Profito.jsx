"use client";
import React, { useState, useEffect } from "react";
import { FaKey, FaPen, FaUser } from "react-icons/fa";
import { useSession, signIn } from "next-auth/react";
import { imageData } from "@/data/imageData";
import { AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import "./profito.css";

export default function Profito() {
  const { data: session, update } = useSession();
  const [newEmail, setNewEmail] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [changep, setChangep] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setNewEmail(session.user.email || "");
      setNewUsername(session.user.username || "");
      setNewAvatar(session.user.avatar || "");
    }
  }, [session]);

  const date = new Date(session?.user?.timeOfJoining);
  const formattedDate = `${date.getDate()}-${date.toLocaleString("default", {
    month: "long",
  })}-${date.getFullYear()}`;

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleSave = async () => {
    const userId = session?.user?.id;
    const updatedFields = {};

    if (changep) {
      if (newPassword.trim() === "" || confirmPassword.trim() === "") {
        toast.error("Please fill both password fields.");
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
    }

    if (!validateEmail(newEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (newEmail !== session?.user?.email) updatedFields.email = newEmail;
    if (newUsername !== session?.user?.username)
      updatedFields.username = newUsername;
    if (newAvatar !== session?.user?.avatar) updatedFields.avatar = newAvatar;
    if (newPassword.trim() !== "") updatedFields.password = newPassword;

    if (Object.keys(updatedFields).length === 0) {
      toast.info("No changes detected.");
      return;
    }

    updatedFields.userId = userId;

    const response = await fetch("/api/updateProfile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields),
    });

    const data = await response.json();

    if (response.ok) {
      if (updatedFields.email || updatedFields.password) {
        await signIn("credentials", {
          email: newEmail,
          password: newPassword || "",
          redirect: false,
        });
      }

      await update({
        trigger: "update",
        email: newEmail,
        username: newUsername,
        avatar: newAvatar,
      });

      toast.success("Profile updated successfully!");
      setShowModal(false);
    } else {
      toast.error(data.message || "Something went wrong.");
    }
  };

  return (
    <div className="comAll">
      <div className="profile-header">
        <FaUser /> Edit Profile
      </div>
      <div className="profile-content">
        <div className="cofs">
          <div className="rofile-image" onClick={() => setShowModal(true)}>
            <img
              src={
                newAvatar ||
                session?.user?.avatar?.replace(
                  "https://img.flawlessfiles.com/_r/100x100/100/avatar/",
                  "https://cdn.noitatnemucod.net/avatar/100x100/"
                ) ||
                "userData?.randomImage"
              }
              className="profile-img"
              alt="Profile"
            />
            <div className="cof-pen" onClick={() => setShowModal(true)}>
              <FaPen />
            </div>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-field">
            <div className="field-label">EMAIL ADDRESS</div>
            <input
              className="field-input"
              type="text"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              name="email"
            />
          </div>
          <div className="profile-field">
            <div className="field-label">YOUR NAME</div>
            <input
              className="field-input"
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              name="name"
            />
          </div>
          <div className="profile-field">
            <div className="field-label">JOINED</div>
            <div className="field-value">{formattedDate}</div>
          </div>

          <div className="paske" onClick={() => setChangep(true)}>
            <FaKey /> Change Password
          </div>

          {changep && (
            <>
              <div className="profile-field">
                <div className="field-label">NEW PASSWORD</div>
                <input
                  className="field-input"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="profile-field">
                <div className="field-label">CONFIRM PASSWORD</div>
                <input
                  className="field-input"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </>
          )}

          {error && (
            <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
          )}

          <div className="save-button" onClick={handleSave}>
            Save
          </div>
        </div>

        <div className="cofs">
          <div className="profile-image" onClick={() => setShowModal(true)}>
            <img
              src={newAvatar || session?.user?.avatar}
              className="profile-img"
              alt="Profile"
            />
            <div className="cof-pen" onClick={() => setShowModal(true)}>
              <FaPen />
            </div>
          </div>
        </div>

        {showModal && (
          <div className="avatar-modal" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowModal(false)}
                className="close-button"
                aria-label="Close"
              >
                <AiOutlineClose />
              </button>

              <h3>Select an Avatar</h3>

              <div className="avatar-selection">
                {Object.keys(imageData.hashtags).map((category) => (
                  <div key={category} className="avatar-category">
                    <h4>{category}</h4>
                    <div className="avatar-images">
                      {imageData.hashtags[category].images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={category}
                          onClick={() => setNewAvatar(img)}
                          className="avatar-image"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="modal-footer">
                <button onClick={() => setShowModal(false)}>Close</button>
                <button
                  onClick={() => {
                    handleSave();
                    setShowModal(false);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
