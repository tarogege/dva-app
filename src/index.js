import dva, { connect } from 'dva';
import { Router, Route } from 'dva/router';
import React from 'react';
import styles from './index.less';
import key from 'keymaster';

// 1. Initialize
const app = dva();

// 2. Model
// Remove the comment and define your model.
//app.model({});
app.model({
  namespace:'count',
  state: {
    record: 0,
    current: 0
  },
  reducers:{
    add(state) {
      const newCurrent = state.current + 1;
      return {
        record: newCurrent > state.record?newCurrent:state.record,
        current:newCurrent
      };
    },
    minus(state) {
      return { ...state, current: state.current - 1};
    }
  },
  effects:{
    *add(action, { call, put }) {
      yield call(delay, 1000);
      yield put({ type: 'minus' });
    },
  },
  subscriptions: {
    keyboardWatcher({ dispatch }) {
      key('⌘+up, ctrl+up', () => { dispatch({type:'add'}) });
    },
  },
});

// 3. Router
const ConstApp = ({count,dispatch}) =>{
  return (
    <div className={styles.normal}>
      <div className={styles.record}>highest record{count.record}</div>
      <div className={styles.current}>{count.current}</div>
      <div className={styles.button}>
        <button onClick={()=>{dispatch({type:'count/add'});}}>+</button>
      </div>
    </div>);
  };
function mapStateToProps(state) {
  return {count: state.count};
}
const HomePage = connect(mapStateToProps)(ConstApp);

app.router(({ history }) =>
  <Router history={history}>
    <Route path="/" exact component={HomePage} />
  </Router>
);

// 4. Start
app.start('#root');

function delay(timeout){
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}
