import { Text } from "@geist-ui/core";
import { styled } from "styled-components";

// const categories = [
//   'Business',
//   'Entertainment',
//   'General',
//   'Health',
//   'Science',
//   'Sports',
//   'Technology'
// ];


const Slogan = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 8px;
  gap: 3rem;
  border-bottom: 1px solid #000;
  box-sizing: border-box;
  text-align: center;
`;

const Slogans = () => {
  return (
    <Slogan>
      <Text small>News That Makes You Say &apos;Wait, What?!&apos; Uncovering the Wackiest Stories You Never Knew Existed!</Text>
    </Slogan>
  )
};

export default Slogans;