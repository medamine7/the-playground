import { styled } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Text } from "@geist-ui/core";
import breakpoints from "../style/breakpoints";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { getOne, setStatus } from "../store/reducers/article";
import { STATUSES } from "../store/constants";
import { updateAppState } from "../store/reducers/app";

const Headline = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 3.75rem auto 0;

  ${breakpoints.mobile`
    margin: 1.25rem auto 0;
  `};

  a {
    text-decoration: underline;
  }
  
  h1 {
    font-size: 2.375rem;
    line-height: 2.875rem;

    ${breakpoints.mobile`
      font-size: 1.9375rem;
      line-height: 2.2rem;

      i {
        font-size: 1.9375rem;
        line-height: 2.2rem;
      }
  `};
  }

    
  h3 {
    ${breakpoints.mobile`
      font-size: 1.25rem;
      line-height: 1.5625rem;
    `};
  }
`;

const Picture = styled.div`
  width: 100%;
  margin-top: 3.75rem;

  img {
    width: 100%;
  }

  ${breakpoints.mobile`
    width: 100vw;
    margin-top: 1.25rem;
  `};
`;

const Content = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 3.75rem auto 0;
  line-height: 2.4rem;
  
  &&& {
    p {
      font-size: 1.2rem;
    }


    ${breakpoints.mobile`
      margin: 1.25rem auto 0;

      p {
        font-size: 1.125rem;
        line-height: 1.5625rem;
      }
    `};
  }
`;

const Article = () => {
  const { active: article, status } = useSelector(state => state.article);
  const { slug, provider } = useParams();
  const dispatch = useDispatch();

  const setLoading = (value) => dispatch(updateAppState({ isLoading: value }));
  
  useEffect(() => {
    if (article) return;
    const id = decodeURIComponent(slug);
    dispatch(getOne({ id, provider }));
  }, []);

  useEffect(() => {
    if ([STATUSES.IDLE, STATUSES.LOADING].includes(status)) return;

  // Fake loading time for demo purposes
    setLoading(false);
    dispatch(setStatus(STATUSES.IDLE));
  }, [status]);

  if (!article) return <Text mt="80px">No article found.</Text>;


  const Body = () => {
    if (!article.content) return 'No content found.'

    return (
      <Content>
        <Text mt={0} p font={'2.2rem'}>
          <span dangerouslySetInnerHTML={{ __html: article.content }}></span>
        </Text>
      </Content>
    )
  };

  return (
    <>
      <Headline>
        <Text h1 i mb={0}>{ article.title }</Text>
        <Text h3 font={1.4} style={{ color: "#363636", fontWeight: "normal", lineHeight: "1.875rem" }}>
          <span dangerouslySetInnerHTML={{ __html: article.description }}></span>
        </Text>
      </Headline>
      <Picture>
        <img src={article.image} alt="" />
      </Picture>
      <Body/>
    </>
  )
};

export default Article;