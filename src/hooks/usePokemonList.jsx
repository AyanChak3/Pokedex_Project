import axios from 'axios';
import {useEffect,useState} from 'react'
function usePokemonList(type){
    const [pokemonListState,setPokemonListState] = useState({
        pokemonList : [],
        isLoading : true,
        pokedexUrl : 'https://pokeapi.co/api/v2/pokemon',
        nextUrl : '',
        prevUrl : '',
    })
    async function downloadPokemons(){

        setPokemonListState((state)=>({...state, isLoading: true}));//{ ...state }: This creates a new object that copies all properties from the current state. The spread operator (...) is used to achieve this.
        const response = await axios.get(pokemonListState.pokedexUrl)//this downloads list of 20 pokemons
        const pokemonResults = response.data.results;//we get the array of pokemons from result
        
        console.log("response is",response.data.pokemon);
        console.log(pokemonListState)
        
        setPokemonListState((state)=>({
         ...state,
         nextUrl : response.data.next,
         prevUrl : response.data.previous
     }))
        const pokemonResultPromise = pokemonResults.map((pokemon)=> axios.get(pokemon.url));//url of 20 pokemons is stored in this array of promise
        
        //passing that promise array to axios.all
        const pokemonData = await axios.all(pokemonResultPromise);//array of 20 pokemon detailed data
        console.log(pokemonData)
        
        //now iterate on the data of each pokemon, and extract id,name,image,types
        const pokeListResult = pokemonData.map((pokeData)=>{ //pokemonData is the whole array of 20 pokemons
            const pokemon = pokeData.data; //we want only the data
            return {//object return type
             id : pokemon.id,
             name : pokemon.name,
             image : (pokemon.sprites.other) ? pokemon.sprites.other.dream_world.front_default : pokemon.sprites.front_shiny,
             types : pokemon.types
         }//from the data section,we want only these properties
        })
        console.log(pokeListResult);
        setPokemonListState((state)=>({
         ...state,
         pokemonList : pokeListResult,
         isLoading:false
          }))
   
   }
   useEffect(()=>{
    downloadPokemons();
    console.log("list",pokemonListState)
 },[pokemonListState.pokedexUrl]);
  
 return [pokemonListState,setPokemonListState]


}
export default usePokemonList;