import { styled } from "styled-components";
import Divider from "~/Divider";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pagination as GeistPagination, Text } from "@geist-ui/core";
import { useNavigate } from "react-router-dom";
import { updateAppState } from "../store/reducers/app";
import { getAll, search, setStatus, updateArticleState } from "../store/reducers/article";
import Filters from "../components/Filters";
import { removeHtml } from "../utils/string";
import breakpoints from "../style/breakpoints";
import { STATUSES } from "../store/constants";

const Feed = styled.div`
  display: grid;
  grid-column-gap: calc(1rem * 2 + 1px);
  grid-template-columns: repeat(20, 1fr);
  padding-top: 1.25rem;
  padding-bottom: 1.5rem;
  align-items: start;
  width: 100%;
  flex: 1;

  ${breakpoints.mobile`
    grid-column-gap: 0;
    margin-top: 30px;
  `};
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  grid-column: span 14;
  position: relative;

  &:after {
    content: '';
    height: calc(100% - 20px);
    position: absolute;
    right: calc(-1rem - 1px);
    border-right: 1px solid #C7C7C7;
  }

  ${breakpoints.mediumScreen`
    grid-column: span 20;

    &:after {
      display: none;
    }
  `}
`;

const Article = styled.article`
  display: grid;
  max-width: 100%;
  max-height: 345px;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 1fr 2fr 30px;
  grid-column-gap: calc(1rem + 5px);
  grid-template-areas:
    "title image"
    "description image"
    "date image";

  ${breakpoints.smallScreen`
    grid-template-columns: 1fr 1fr;
  `}

  ${breakpoints.mobile`
    grid-template-rows: auto auto auto 335px;
    grid-template-columns: 1fr 1fr;
    grid-row-gap: 10px;
    grid-template-areas:
        "title title"
        "description description"
        "date date"
        "image image";
    align-items: start;
    max-height: unset;
  `}
`;

const Title = styled.a`
  line-height: 1.375rem;
  grid-area: title;

  &:hover {
    color: var(--theplayground-grey-color);
  }

  &&& {
    h1 {
      ${breakpoints.mobile`
        margin: 0;
        font-size: 1.25rem;
        line-height: 1.15em;    
      `}
    }
  }
`;

const Description = styled.a`
  color: var(--theplayground-grey-color);
  line-height: 1.25rem;
  grid-area: description;
`;

const PublishedAt = styled(Text)`
  grid-area: date;

  &&& {
    color: #727272;
    font-family: var(--theplayground-font-primary);
    grid-area: date;
    align-self: end;
  }
`;

const Picture = styled.a`
  grid-area: image;
  width: 100%;
  height: 100%;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`;

const Pagination = styled(GeistPagination)`
  grid-column: span 20;
  display: flex;
  justify-content: center;

  &&& {
    button {
      color: black;

      &.active {
        color: white;
        background: black;
      }

      &.disabled {
        color: #888;
      }
    }
  }
`;

const Home = () => {
  const { articles, status, author, source, category, page, query } = useSelector((state) => state.article);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const setLoading = (value) => dispatch(updateAppState({ isLoading: value }));

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      const action = query ? search : getAll;
      dispatch(action());
    };

    fetchNews();
    return () => {};
  }, [page]);

  useEffect(() => {
    if ([STATUSES.IDLE, STATUSES.LOADING].includes(status)) return;

    // Fake loading time for demo purposes
    setTimeout(() => {
      setLoading(false);
      dispatch(setStatus(STATUSES.IDLE));
    }, 2000);
  }, [status]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
      timeZoneName: 'short'
    };

    return date.toLocaleString('en-US', options);
  };
  

  const getLink = (article) => {
    const id = encodeURIComponent(article.id);
    return `/article/${article.provider}/${id}`;
  }

  const handleNavigation = (event, article) => {
    const target = event.target;
  
    if ('clickable' in target.dataset) {
      event.preventDefault();
      
      const url = getLink(article);
      dispatch(updateArticleState({ active: article }));
      navigate(url);
    }
  }

  const filteredArticles = useMemo(() => {
    let filtered = articles;

    if (source) filtered = filtered.filter((article) => article.source === source);
    if (author) filtered = filtered.filter((article) => article.author === author);
    if (category) filtered = filtered.filter((article) => article.category === category);
    
    return filtered;
  }, [articles, source, author, category]);

  const updatePage = (page) => {
    dispatch(updateArticleState({ page }));
  }

  if (articles?.length === 0) return null;

  return (
    <Feed>
      <Section>
        {
          filteredArticles?.map((article, index) => (
            <div key={index}>
              <Article onClick={(e) => handleNavigation(e, article)}>
                <Title>
                  <Text data-clickable="true" h1 mt={0}>{article.title}</Text>
                </Title>
                <Description>
                  <Text data-clickable="true" p margin={0}>{removeHtml(article.description)}</Text>
                </Description>
                <Picture>
                  <img data-clickable="true" src={article.image || '/fallback.jpg'} alt={article.title} />
                </Picture>
                <PublishedAt small font={.7}>{formatDate(article.date)}</PublishedAt>
              </Article>
              <Divider />
            </div>
          ))
        }

      </Section>
      <Filters></Filters>
      <Pagination count={5} initialPage={page} mt="30px" onChange={updatePage}/>
    </Feed>
  );
};

export default Home;
