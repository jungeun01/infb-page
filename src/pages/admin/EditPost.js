// src/pages/admin/EditPost.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, updatePost } from "../../store/slices/postsSlice";
import Board from "../../components/Board";
import "../../styles/pages/_contentManagement.scss";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchPosts({ collectionName: "posts", queryOptions: {} }));
  }, [dispatch]);

  useEffect(() => {
    if (posts && posts.length > 0) {
      const foundPost = posts.find((p) => p.docId === id);
      if (foundPost) {
        setPost(foundPost);
      } else {
        alert("게시글을 찾을 수 없습니다.");
        navigate("/admin/posts");
      }
    }
    setLoading(false);
  }, [posts, id, navigate]);

  const handleSave = async (formData) => {
    try {
      await dispatch(
        updatePost({
          collectionName: "posts",
          docId: id,
          data: {
            ...formData,
            updatedAt: new Date(),
          },
        })
      );
      alert("게시글이 수정되었습니다.");
      navigate("/admin/posts");
    } catch (error) {
      console.error("게시글 수정 실패:", error);
      alert("게시글 수정에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    navigate("/admin/posts");
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="edit-post">
      <h2>게시글 수정</h2>
      <Board
        mode="edit"
        initialData={post}
        onSave={handleSave}
        onClose={handleCancel}
      />
    </div>
  );
};

export default EditPost;
