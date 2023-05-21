import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import services from "../../api";
import { STATUSES, UNKNOWN_ERROR_MESSAGE } from '../constants';

export const getAll = createAsyncThunk('article/getAll', async (payload, { rejectWithValue, getState }) => {
  try {
    const { article } = getState();
    const { page, pageSize } = article;

    const { data } = await services.news.get('/news/headlines', {
      params: {
        page,
        pageSize,
      },
    });

    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || UNKNOWN_ERROR_MESSAGE);
  }
});

export const search = createAsyncThunk('article/search', async (payload, { rejectWithValue, getState }) => {
  const { article } = getState();
  const { page, pageSize, query } = article;

  try {
    const { data } = await services.news.get('/news/search', {
      params: {
        query,
        page,
        pageSize,
      },
    });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || UNKNOWN_ERROR_MESSAGE);
  }
});

export const getOne = createAsyncThunk('article/getOne', async (payload, { rejectWithValue }) => {
  try {
    const { id, provider } = payload;
    const { data } = await services.news.get(`/news/${provider}/${id}`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || UNKNOWN_ERROR_MESSAGE);
  }
});

export const articleSlice = createSlice({
  name: 'article',
  initialState: {
    provider: 'NewsApi',
    active: null,
    source: null,
    author: null,
    category: null,
    articles: [],
    sources: [],
    authors: [],
    categories: [],
    status: STATUSES.IDLE,
    error: null,
    page: 1,
    pageSize: 10,
    query: '',
  },
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    updateArticleState: (state, { payload }) => {
      return {
        ...state,
        ...payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
    // getAll
    .addCase(getAll.fulfilled, (state, action) => {
      const { articles, totalResults, authors, sources, categories } = action.payload;

      return {
        ...state,
        articles,
        count: totalResults,
        authors,
        sources,
        categories,
        status: STATUSES.SUCCESS,
      }
    })
    .addCase(getAll.pending, (state) => {
      state.status = STATUSES.LOADING;
    })
    .addCase(getAll.rejected, (state, action) => {
      state.status = STATUSES.ERROR;
      state.error = action.payload;
    })
    // search
    .addCase(search.fulfilled, (state, action) => {
      const { articles, totalResults, authors, sources, categories } = action.payload;

      return {
        ...state,
        articles,
        count: totalResults,
        authors,
        sources,
        categories,
        status: STATUSES.SUCCESS,
      }
    })
    .addCase(search.pending, (state) => {
      state.status = STATUSES.LOADING;
    })
    // getOne
    .addCase(getOne.fulfilled, (state, action) => {
      const article = action.payload;

      return {
        ...state,
        active: article,
        status: STATUSES.SUCCESS,
      }
    })
    .addCase(getOne.pending, (state) => {
      state.status = STATUSES.LOADING;
    })
    .addCase(getOne.rejected, (state, action) => {
      state.status = STATUSES.ERROR;
      state.error = action.payload;
    })
  },
});

export const { setStatus, updateArticleState } = articleSlice.actions;

export default articleSlice.reducer