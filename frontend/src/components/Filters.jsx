import { styled } from "styled-components";
import { Input as geistInput, Text, Select as geistSelect, Description, Spacer, Button, Drawer, Grid } from "@geist-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { getAll, search, setStatus, updateArticleState } from "../store/reducers/article";
import breakpoints from '../style/breakpoints';
import { useEffect, useState } from "react";
import { updateAppState } from "../store/reducers/app";
import { STATUSES } from "../store/constants";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  grid-column: span 6;
  box-sizing: border-box;
  padding: 20px 0;
  position: sticky;
  top: 40px;
  border-radius: 3px;
`;

const Wrapper = ({ children }) => {
  const dispatch = useDispatch();
  const breakpoint = breakpoints.useBreakpoint();
  const { showMenu } = useSelector((state) => state.app);

  const closeMenu = () => {
    dispatch(updateAppState({ showMenu: false }));
  }

  if (['mediumScreen', 'mobile'].includes(breakpoint)) return (
    <Drawer visible={showMenu} placement="left" onClose={closeMenu} w="80%" pt="80px" style={{ maxWidth: "350px" }}>
      {children}
    </Drawer>
  );

  return (
    <Container>
      {children}
    </Container>
  )
};

const Select = styled(geistSelect)`
  &&& {
    border: 1px solid #DFDFDF;
  }
`;

const Input = styled(geistInput)`
  &&& {
    width: 100%;
    
    .input-wrapper {
      border: 1px solid #DFDFDF;
    }
  }
`;

const Option = styled(geistSelect.Option)`
  font-weight: bold;
`;

const Filters = () => {
  const dispatch = useDispatch();
  const { categories, sources, authors, source, author, category } = useSelector((state) => state.article);
  const setLoading = (value) => dispatch(updateAppState({ isLoading: value }));
  const { status } = useSelector((state) => state.article);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (event) => {
    if ((event.type === "keydown" && event.key !== 'Enter') || !searchQuery) return;
    
    setLoading(true);
    dispatch(updateArticleState({ query: searchQuery }));
    dispatch(search());
    dispatch(updateAppState({ showMenu: false }))
  }

  const resetArticles = () => {
    setLoading(true);
    dispatch(updateArticleState({ query: '', page: 1 }));
    dispatch(getAll());
    setSearchQuery('');
  };


  useEffect(() => {
    if ([STATUSES.IDLE, STATUSES.LOADING].includes(status)) return;

    // Fake loading time for demo purposes
    setTimeout(() => {
      setLoading(false);
      dispatch(setStatus(STATUSES.IDLE));
    }, 2000);
  }, [status]);

  const setSource = (value) => {
    dispatch(updateArticleState({ source: value }));
  };

  const setAuthor = (value) => {
    dispatch(updateArticleState({ author: value }));
  };

  const setCategory = (value) => {
    dispatch(updateArticleState({ category: value }));
  };

  const resetFilters = () => {
    setSource('');
    setAuthor('');
    setCategory('');
  };

  return (
    <Wrapper>
      <Description scale={1.4} title="Search" />
      <Input placeholder="What are you looking for?" clearable initialValue="" value={searchQuery} onChange={event => setSearchQuery(event.target.value)} onKeyDown={handleSearch}></Input>
      <Spacer h={1} />
      <Grid.Container gap={1}>
        <Grid xs={16}>
          <Button width="100%" type="secondary-light" onClick={handleSearch}>Search</Button>
        </Grid>
        <Grid xs={8}>
          <Button width="100%" onClick={resetArticles}>Reset</Button>
        </Grid>
      </Grid.Container>

      <Spacer h={3} />
      <Description scale={1.4} title="Filter" />
      <Spacer h={.5} />
      <Text small style={{ color: '#444' }} font="14px">Source</Text>
      <Spacer h={.5} />
      <Select initialValue={source} value={source} placeholder="Choose a news source" onChange={setSource}>
        { sources.map((source, index) => <Option key={index} value={source}>{ source }</Option>) }
      </Select>
      <Spacer h={1} />

      <Text small style={{ color: '#444' }} font="14px">Author</Text>
      <Spacer h={.5} />
      <Select initialValue={author} value={author} placeholder="Choose an author" onChange={setAuthor}>
        { authors.map((author, index) => <Option key={index} value={author}>{ author }</Option>) }
      </Select>
      <Spacer h={1} />


      <Text small style={{ color: '#444' }} font="14px">Category</Text>
      <Spacer h={.5} />
      <Select placeholder="Choose a category" onChange={setCategory} value={category}>
        { categories.map((category, index) => <Option key={index} value={category}>{ category }</Option>)}
      </Select>
      <Spacer h={1} />
      <Button disabled={!author && !source && !category} width="100%" type="secondary-light" onClick={resetFilters}>Reset filters</Button>
    </Wrapper>
  )
};

export default Filters;