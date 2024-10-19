'use client'

export const ButtonTest=({name}:any)=>{
    console.log('TEST');
    return  <button onClick={()=>{console.log('TEST click')}}>test</button>
}