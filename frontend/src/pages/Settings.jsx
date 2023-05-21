import { Button, Card, Grid, Input, Spacer, Text } from "@geist-ui/core";
import { Edit, User as UserIcon } from "@geist-ui/icons";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "styled-components";
import { updateUser } from "../store/reducers/auth";

const Container = styled.div`
  text-align: left;
  width: 100%;
  box-sizing: border-box;
  padding-top: 60px;
  max-width: 600px;
`;

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const [name, setName] = useState(user.name);
  const dispatch = useDispatch();

  const handleNameChange = () => {
    if (name === user.name || !name) return;
    dispatch(updateUser({ name }));
  };

  return (
    <Container>
      <Card padding="20px" paddingTop="10px">
        <Grid.Container gap={2} width="100%">
          <Grid xs={24} alignItems="center" justify="end">
            <UserIcon size={24}/><Spacer inline w={.8}/><Text margin={0} h2 marginTop="10px">{ user.name }</Text>
          </Grid>
          <Spacer h={2}/>
          <Grid xs={24} >
            <Text margin={0} h3>Settings</Text>
          </Grid>
          <Grid xs={24}>
            <Text margin={0} small>Here you can update your details.<br></br>(Only name for demo purposes)</Text>
          </Grid>
          <Grid sm={24}>
            <Spacer h={1}/>
          </Grid>
          <Grid sm={20} xs={24}> 
            <Text small style={{ color: '#444' }} font="14px">Name</Text>
          </Grid>
          <Grid sm={20} xs={24}> 
            <Input placeholder="Your name" width="100%" value={name} onChange={e => setName(e.target.value)}/>
          </Grid>
          <Grid xs={24} sm>
            <Button disabled={!name || name === user.name} width="100%" type="secondary-light" iconRight={<Edit/>} onClick={handleNameChange}></Button>
          </Grid>
        </Grid.Container>
      </Card>
    </Container>
  );
};

export default Settings;