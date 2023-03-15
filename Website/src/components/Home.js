import "../style/Home.css"
import firebase from './firebase';


import React, { 
    useState, 
    useEffect 
} from 'react';




function Home({selectedSources, setSelectedSources}){
    var refs = [];
    useEffect(() => {
        const storedSources = JSON.parse(localStorage.getItem('selectedSources'));
        setSelectedSources(storedSources);
      }, []);
    
      useEffect(() => {
        localStorage.setItem('selectedSources', JSON.stringify(selectedSources));
        //const ref = firebase.firestore().collection("Sources").doc(selectedSources[0]).collection("Articles");
      }, [selectedSources]);

    //Firebase
    const [sources, setsources] = useState([]);
    const [loading, setloading] = useState(false);

    //console.log(selectedSources.length);

    const handleHeaderClick = (link) => {
        window.open(link, "_blank");
    };

    const sources1 = JSON.parse(localStorage.getItem("sources1"));
    const selectedSources1 = JSON.parse(localStorage.getItem("selectedSources"));

    console.log(selectedSources1);

    refs = [
        firebase.firestore().collection("Sources").doc(selectedSources1[0]).collection("Articles"),
        firebase.firestore().collection("Sources").doc(selectedSources1[1]).collection("Articles"),
        firebase.firestore().collection("Sources").doc(selectedSources1[2]).collection("Articles")
    ];

    

    function getsources(){
        setloading(true);
        const items = [];

        refs.forEach((ref) => {
            ref.onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) =>{
                    items.push(doc.data());
                });
                setsources(items);
                setloading(false);
            });
        });
    }

    useEffect(() =>{
        getsources()
    }, [])

    if(loading){
        return <h1>Loading...</h1>
    }



    



    return (
        <div>
        <div className="center">
            {sources.map((art) => (
        
            <div className="border" key={art.id}>
                <h3 className="header" onClick={() => handleHeaderClick(art.link)}>
                    {art.header}
                </h3>
                <p className="bodyText">{art.text}</p>
            
            </div>

            ))}
            
        </div>        
        </div>
        
    );
};
  
export default Home;