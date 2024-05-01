import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Segment,
  Item,
  Dropdown,
  Divider,
  Button,
  Message,
} from 'semantic-ui-react';

import mindImg from '../../images/one.jpg';
import { CATEGORIES, NUM_OF_QUESTIONS, DIFFICULTY, QUESTIONS_TYPE, COUNTDOWN_TIME } from '../../constants';
import { shuffle } from '../../utils';
import Offline from '../Offline';
import mockData from './../Quiz/mock.json';

const Main = ({ startQuiz }) => {
  const [numOfQuestions, setNumOfQuestions] = useState(5);
  const [countdownTime, setCountdownTime] = useState({
    hours: 0,
    minutes: 120,
    seconds: 0,
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [offline, setOffline] = useState(false);

  const handleTimeChange = (e, { name, value }) => {
    setCountdownTime({ ...countdownTime, [name]: value });
  };

  const fetchData = () => {
    setProcessing(true);
    setError(null); // Reset error state

    setTimeout(() => {
      try {
        const { response_code, results } = mockData;

        if (response_code === 1) {
          const message = (
            <p>
              The API doesn't have enough questions for your query. (Ex. Asking for 50 Questions in a Category that only has 20.)
              <br />
              <br />
              Please change the <strong>No. of Questions</strong>, <strong>Difficulty Level</strong>, or <strong>Type of Questions</strong>.
            </p>
          );

          setProcessing(false);
          setError({ message });
          return;
        }

        results.forEach(element => {
          element.options = shuffle([
            element.correct_answer,
            ...element.incorrect_answers,
          ]);
        });

        setProcessing(false);
        startQuiz(results, countdownTime.hours * 3600 + countdownTime.minutes * 60 + countdownTime.seconds);
      } catch (error) {
        setProcessing(false);
        setError(error);
      }
    }, 1000);
  };

  if (offline) return <Offline />;

  const allFieldsSelected = countdownTime.hours || countdownTime.minutes || countdownTime.seconds;

  return (
    <Container>
      <Segment>
        <Item.Group divided>
          <Item>
            <Item.Image src={mindImg} />
            <Item.Content>
              <Item.Header>
                <h1>Quiz test | anodra.uz</h1>
              </Item.Header>
              {error && (
                <Message error onDismiss={() => setError(null)}>
                  <Message.Header>Error!</Message.Header>
                  {error.message}
                </Message>
              )}
              <Divider />
              <Item.Meta>
                <p>Testlarni qaysi kategoriyada o'qishni xohlaysiz?</p>
                <Dropdown
                  fluid
                  selection
                  name="category"
                  placeholder="Pedagogika"
                  header="Test kategoriyasini tanlang."
                  options={CATEGORIES}
                  value="Pedagogika"
                  disabled={processing}
                />
                <br />
                <p>Testda nechta savol bo'lishini istaysiz?</p>
                <Dropdown
                  fluid
                  selection
                  name="numOfQ"
                  placeholder="Savollar sonini belgilang"
                  header="Savollar sonini belgilang"
                  options={NUM_OF_QUESTIONS}
                  value={numOfQuestions}
                  onChange={(e, { value }) => setNumOfQuestions(value)}
                  disabled={processing}
                />
                <br />
                <p>Testning darajasini belgilang.</p>
                <Dropdown
                  fluid
                  selection
                  name="difficulty"
                  placeholder="Test darajasini belgilang"
                  header="Test darajasini belgilang"
                  options={DIFFICULTY}
                  value="medium"
                  disabled={processing}
                />
                <br />
                <p>Testda qaysi turdagi savollarni xohlaysiz?</p>
                <Dropdown
                  fluid
                  selection
                  name="type"
                  placeholder="Aralash"
                  header="Test turini tanlang"
                  options={QUESTIONS_TYPE}
                  value="multiple"
                  disabled={processing}
                />
                <br />
                <p>Testni yechish uchun vaqtni belgilang.</p>
                <Dropdown
                  search
                  selection
                  name="hours"
                  placeholder="Soatni belgilang"
                  header="Soatni belgilang"
                  options={COUNTDOWN_TIME.hours}
                  value={countdownTime.hours}
                  onChange={handleTimeChange}
                  disabled={processing}
                />
                <Dropdown
                  search
                  selection
                  name="minutes"
                  placeholder="Daqiqani belgilang"
                  header="Daqiqani belgilang"
                  options={COUNTDOWN_TIME.minutes}
                  value={countdownTime.minutes}
                  onChange={handleTimeChange}
                  disabled={processing}
                />
                <Dropdown
                  search
                  selection
                  name="seconds"
                  placeholder="Soniyani belgilang"
                  header="Soniyani belgilang"
                  options={COUNTDOWN_TIME.seconds}
                  value={countdownTime.seconds}
                  onChange={handleTimeChange}
                  disabled={processing}
                />
              </Item.Meta>
              <Divider />
              <Item.Extra>
                <Button
                  primary
                  size="big"
                  icon="play"
                  labelPosition="left"
                  content={processing ? 'Jarayonda...' : 'Hoziroq boshlash'}
                  onClick={fetchData}
                  disabled={!allFieldsSelected || processing}
                />
              </Item.Extra>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <br />
    </Container>
  );
};

Main.propTypes = {
  startQuiz: PropTypes.func.isRequired,
};

export default Main;
