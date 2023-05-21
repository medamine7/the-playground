import { Button, Input, Modal, Text } from "@geist-ui/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import { login, register, setStatus } from "../store/reducers/auth";
import { useDispatch, useSelector } from "react-redux";
import breakpoints from "../style/breakpoints";
import { STATUSES } from "../store/constants";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: flex-start;
  flex-direction: column;
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  justify-content: stretch;
  flex-direction: column;
  margin-top: 30px;
  max-width: 450px;
  width: 100%;
  margin: 80px auto 0;

  ${breakpoints.smallScreen`
    margin: 30px auto 0;
  `}
`;

const Label = styled.label`
  font-size: 0.875rem;
  margin: 10px 0 10px;
  align-self: flex-start;
  font-family: var(--theplayground-font-secondary);
  display: inline-block;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-top: 10px;
`;

const Warning = styled(Text)`
  font-size: 0.75rem;
  margin: 0;
  position: absolute;
  left: 0;
  top: calc(100% + 5px);
`;

const Switch = styled.a`
  font-size: 0.875rem;
  margin: 30px 0 0;
  text-decoration: underline;
`;

const Submit = styled(Button)`
  &&& {
    margin-top: 40px;
    width: 100%;
  }
`;

const Authentication = () => {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const formRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);

  const [isModalOn, setIsModalOn] = useState(false);
  const [modalContent, setModalContent] = useState({});

  const closeModal = () => {
    setIsModalOn(false)
  }

  useEffect(() => {
    if (user) return navigate('/');
  }, [user, navigate]);

  const config = useMemo(() => {
    const settings = {
      login: {
        title: "Log in or create an account",
        submit: "Login",
        switch: "Don't have an account?",
        action: login,
      },
      register: {
        title: "Create an account",
        submit: "Sign up",
        switch: "Already have an account?",
        action: register,
      },
    };

    return isLogin ? settings.login : settings.register;
  }, [isLogin]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const initialValidation = {
    name: {
      valid: false,
    },
    email: {
      valid: false,
    },
    password: {
      valid: false,
    },
    passwordConfirmation: {
      valid: false,
    },
  };

  const [validation, setValidation] = useState(initialValidation);
  
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newValidation = {
      dirty: true,
      name: {
        valid: formData.name?.length > 3,
        required: !isLogin,
      },
      email: {
        valid: formData.email.length > 5,
        required: true,
      },
      password: {
        valid: formData.password.length >= 8,
        required: true,
      },
      passwordConfirmation: {
        valid: formData.password_confirmation === formData.password,
        required: !isLogin,
      },
    };

    setValidation({
      ...validation,
      ...newValidation,
    });

    if(Object.values(newValidation).some(v => !v.valid && v.required && newValidation.dirty )) return;

    const payload = {
      email: formData.email,
      password: formData.password,
      ...(isLogin ? {} : { 
        name: formData.name,
        password_confirmation: formData.password_confirmation,
      }),
    };

    setLoading(true);
    dispatch(config.action(payload));
  };

  useEffect(() => {
    if ([STATUSES.IDLE, STATUSES.LOADING].includes(status)) return; 
  
    if (status === STATUSES.ERROR) {
      setLoading(false);
      setModalContent({
        title: 'Error',
        message: error,
        action: 'Ok',
      });
      setIsModalOn(true);
      dispatch(setStatus(STATUSES.IDLE));

      return;
    }

    if (status === STATUSES.SUCCESS && user) {
      dispatch(setStatus(STATUSES.IDLE));
      return navigate('/');
    }

    setModalContent({
      title: 'Welcome aboard!',
      message: 'Your account has been created',
      action: 'Ok',
    });
    setLoading(false);
    setIsModalOn(true);
    setIsLogin(true);
    reset();
  }, [navigate, user, status, dispatch])

  const reset = () => {
    setFormData({
      email: '',
      password: '',
      name: '',
      password_confirmation: '',
    });

    setValidation(initialValidation);
  }

  const handleSwitch = () => {
    if (loading) return;
    setIsLogin(v => !v);
  };

  useEffect(() => {
    focusInput(isLogin ? 'email' : 'name');
    reset();
  }, [isLogin]);

  const focusInput = (name) => {
    const input = formRef.current.querySelector(`input[name="${name}"]`);
    input?.focus();
  }

  const getInputType = (property) => validation.dirty && !validation[property].valid ? "error" : "secondary";

  return (
    <>
      <Modal visible={isModalOn} onClose={closeModal}>
        <Modal.Title>{modalContent.title}</Modal.Title>
        <Modal.Content>
          <p style={{ textAlign: 'center' }}>{modalContent.message}</p>
        </Modal.Content>
        <Modal.Action onClick={() => setIsModalOn(false)}>{modalContent.action}</Modal.Action>
      </Modal>
      
      <Container>
        <Form onSubmit={handleSubmit} onChange={handleChange} ref={formRef}>
          <Text h2 font={1.8} style={{ fontWeight: "normal" }}>{config.title}</Text>

          {
            !isLogin && (
              <InputWrapper>
                <Label>Name</Label>
                <Input disabled={loading} type={getInputType('name')} width="100%" htmlType="text" name="name" value={formData.name}/>
                { validation.dirty && !validation.name.valid && <Warning type="error">Please enter your full name.</Warning> }
              </InputWrapper>
            )
          }

          <InputWrapper>
            <Label>Email</Label>
            <Input disabled={loading} type={getInputType('email')} width="100%" htmlType="email" name="email" value={formData.email}/>
            { validation.dirty && !validation.email.valid && <Warning type="error">Please enter your email address.</Warning> }
          </InputWrapper>

          <InputWrapper>
            <Label>Password</Label>
            <Input.Password disabled={loading} type={getInputType('password')} width="100%" htmlType="password" name="password" value={formData.password}/>
            { validation.dirty && !validation.password.valid && <Warning type="error">Please enter your password.</Warning> }
          </InputWrapper>

          {
            !isLogin && (
              <InputWrapper>
                <Label>Password confirmation</Label>
                <Input.Password disabled={loading} type={getInputType('passwordConfirmation')} width="100%" htmlType="password" name="password_confirmation" value={formData.passwordConfirmation}/>
                { validation.dirty && !validation.passwordConfirmation.valid && <Warning type="error">The password confirmation does not match.</Warning> }
              </InputWrapper>
            )
          }
          <Submit loading={loading} htmlType="submit" auto type="secondary-light">{config.submit}</Submit>
          <Switch style={loading ? { cursor: "default" } : {}} onClick={handleSwitch}>{ config.switch }</Switch>
        </Form>
      </Container>
    </>
  );
};

export default Authentication;