import React from 'react';
import './App.css';
import Customer from './components/Customer';

const customers = [
  {
    'id' : '1',
    'image' : 'https://placeimg.com/64/64/1',
    'name' : '다현',
    'birthday' : '921021',
    'gender' : '여자',
    'job' : '학생'
  },
  {
    'id' : '2',
    'image' : 'https://placeimg.com/64/64/2',
    'name' : '희영',
    'birthday' : '921021',
    'gender' : '남자',
    'job' : '학생'
  },
  {
    'id' : '3',
    'image' : 'https://placeimg.com/64/64/3',
    'name' : '희동',
    'birthday' : '921021',
    'gender' : '남자',
    'job' : '개'
  }
]

function App() {
  return (
    <div>
      {
        customers.map(c => {
          return (
            <Customer
              key={c.id}
              id={c.image}
              image={c.image}
              name={c.name}
              birthday={c.birthday}
              gender={c.gender}
              job={c.job}
            />
          )
        })
      }
    </div>
  );
}

export default App;
