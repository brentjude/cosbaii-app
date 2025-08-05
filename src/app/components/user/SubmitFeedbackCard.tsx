// src/app/components/user/SubmitFeedbackCard.tsx
"use client";

import { useState } from "react";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import FeedbackModal from "./modals/FeedbackModal";
import type { FeedbackFormData } from "@/types";

const SubmitFeedbackCard = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmitFeedback = async (
    data: FeedbackFormData
  ): Promise<boolean> => {
    setLoading(true);

    try {
      const response = await fetch("/api/user/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // ✅ Remove alert - success is now handled in modal
        return true;
      } else {
        // Show error message (you can also handle this in the modal)
        alert(result.message || "Failed to submit feedback. Please try again.");
        return false;
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="card bg-base-100 shadow-xl mt-6">
        <div className="card-body text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChatBubbleLeftEllipsisIcon className="w-8 h-8 text-primary" />
          </div>
          <h3 className="card-title justify-center text-lg">Submit Feedback</h3>
          <p className="text-sm opacity-70">
            Help us improve Cosbaii by sharing your thoughts, reporting bugs, or
            suggesting features.
          </p>
          <div className="card-actions justify-center mt-4">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowModal(true)}
            >
              Give Feedback
            </button>
          </div>
        </div>
      </div>

      <FeedbackModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitFeedback}
        loading={loading}
      />
    </>
  );
};

export default SubmitFeedbackCard;
