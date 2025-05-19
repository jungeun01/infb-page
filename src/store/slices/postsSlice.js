import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteDatas,
  getDatas,
  updateDatas,
  getAnswers,
  addAnswer,
  updateAnswer,
  deletePostWithAnswers,
  addDatas,
} from "../../pages/API/firebase";

const initialState = {
  posts: [],
  status: "idle",
  error: null,
  loading: false,
  answers: {}, // { postId: { exists: boolean, data: [] } }
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.posts = action.payload;
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const { docId, data } = action.payload;
        const post = state.posts.find((p) => p.docId === docId);
        if (post) {
          Object.assign(post, data);
        }
      });

    // 답변 조회
    builder
      .addCase(fetchAnswers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAnswers.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, exists, data } = action.payload;
        state.answers[postId] = { exists, data };
      })
      .addCase(fetchAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // 답변 추가
    builder
      .addCase(createAnswer.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAnswer.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, answer } = action.payload;
        if (!state.answers[postId]) {
          state.answers[postId] = { exists: true, data: [] };
        }
        state.answers[postId].exists = true;
        state.answers[postId].data.push(answer);
      })
      .addCase(createAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // 답변 수정
    builder
      .addCase(updateAnswerThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAnswerThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, answerId, answer } = action.payload;
        if (state.answers[postId]) {
          const index = state.answers[postId].data.findIndex(
            (a) => a.id === answerId
          );
          if (index !== -1) {
            state.answers[postId].data[index] = answer;
          }
        }
      })
      .addCase(updateAnswerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // 게시글 삭제
    builder
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter(
          (post) => post.docId !== action.payload.docId
        );
        state.answers = action.payload.answers;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // 게시글 생성
    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Timestamp를 직렬화 가능한 형태로 변환하는 함수
const serializeTimestamp = (timestamp) => {
  if (!timestamp) return null;
  if (typeof timestamp === "string") return timestamp;
  if (timestamp.toDate) return timestamp.toDate().toISOString();
  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000).toISOString();
  }
  return null;
};

// 게시글 데이터 직렬화 함수
const serializePost = (post) => ({
  ...post,
  createdAt: serializeTimestamp(post.createdAt),
  updatedAt: serializeTimestamp(post.updatedAt),
  answers: post.answers?.map((answer) => ({
    ...answer,
    createdAt: serializeTimestamp(answer.createdAt),
    updatedAt: serializeTimestamp(answer.updatedAt),
  })),
});

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ collectionName, queryOptions }, { rejectWithValue }) => {
    try {
      const result = await getDatas(collectionName, queryOptions);
      return result.map(serializePost);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ collectionName, docId, data }, { rejectWithValue }) => {
    try {
      const result = await updateDatas(collectionName, docId, data);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async ({ collectionName, docId }, { rejectWithValue, getState }) => {
    try {
      await deletePostWithAnswers(docId);

      // answers 상태에서도 해당 게시글의 답변 정보 제거
      const state = getState();
      const newAnswers = { ...state.posts.answers };
      delete newAnswers[docId];

      return { docId, answers: newAnswers };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAnswers = createAsyncThunk(
  "posts/fetchAnswers",
  async (postId) => {
    const response = await getAnswers(postId);
    // 답변 데이터 직렬화
    const serializedData = response.data?.map((answer) => ({
      ...answer,
      createdAt: serializeTimestamp(answer.createdAt),
      updatedAt: serializeTimestamp(answer.updatedAt),
    }));
    return {
      postId,
      exists: response.exists,
      data: serializedData || [],
    };
  }
);

export const createAnswer = createAsyncThunk(
  "posts/createAnswer",
  async ({ postId, answerData }) => {
    const response = await addAnswer(postId, answerData);
    return { postId, answer: response };
  }
);

export const updateAnswerThunk = createAsyncThunk(
  "posts/updateAnswer",
  async ({ postId, answerId, answerData }) => {
    const response = await updateAnswer(postId, answerId, answerData);
    return { postId, answerId, answer: response };
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async ({ collectionName, data }, { rejectWithValue }) => {
    try {
      const result = await addDatas(collectionName, data);
      return { ...data, docId: result.id };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const { postAdded } = postsSlice.actions;

export default postsSlice.reducer;
