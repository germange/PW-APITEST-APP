import { request, expect } from "playwright/test"


async function globalTeardown(){
    const context = await request.newContext()
    const deleteArticleResponce = await context.delete(`https://conduit-api.bondaracademy.com/api/articles/${process.env.SLUGID}`,{
        headers: {
            Authorization: `Token ${process.env.ACCESS_TOKEN}`
        }    
    })  
    expect (deleteArticleResponce.status()).toEqual(204)
}

export default globalTeardown;