import { request, expect } from "playwright/test"
import user from '../PW-APITEST-APP/.auth/user.json'
import fs from 'fs'

async function globalSetup(){

    const authFile = '.auth/user.json'

    const context = await request.newContext()

    const responceToken = await context.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
          "user":{"email":"blandino@test.com","password":"1111"}
        }
      })
      const responceBody = await responceToken.json()
      const accessToken = responceBody.user.token

      user.origins[0].localStorage[0].value = accessToken
      fs.writeFileSync(authFile, JSON.stringify(user))

      process.env['ACCESS_TOKEN'] = accessToken


          const articleResponce = await context.post('https://conduit-api.bondaracademy.com/api/articles/', {
            data: {
              "article":{"title":"GLobal Likes test article","description":"This is a test description","body":"This is test body","tagList":[]}
            },
            headers: {
                Authorization: `Token ${process.env.ACCESS_TOKEN}`
            }
          })
          expect (articleResponce.status()).toEqual(201)
          const responce = await articleResponce.json()
          const slugId = responce.article.slug
          process.env['SLUGID'] = slugId
}

export default globalSetup;