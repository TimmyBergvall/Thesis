
import "../style/Home.css"
import firebase from './firebase';

import React, { 
    useState, 
    useEffect 
} from 'react';




function Home(){
//Firebase
const [Articles, setarticles] = useState([]);
const [loading, setloading] = useState(false);

  const ref = firebase.firestore().collection("Articles")
  console.log(ref);

  function getarticles(){
    setloading(true)
    ref.onSnapshot((querySnapshort) => {
        const items = []
        querySnapshort.forEach((doc) =>{
            items.push(doc.data())
        })
        setarticles(items)
        setloading(false)

    })
  }

  useEffect(() =>{
    getarticles()
  }, [])

  if(loading){
    return <h1>Loading...</h1>
}

    return (
        <div>
        <div className="center">
            <h1 className="shadow">Articles</h1>
            {Articles.map((art) => (
        
            <div className="border" key={art.id}>
                
                <h2>{art.header}</h2>
                <h2>{art.text}</h2>
                <h2>{art.link}</h2>
            
            </div>

            ))}
            
        </div>        
        </div>


        
        



        
        
        
    );
};
  
export default Home;