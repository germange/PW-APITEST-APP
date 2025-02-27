import { test as setup } from '@playwright/test';
import user from '../.auth/user.json'
import fs from 'fs'

const authFile = '.auth/user.json'

setup('authentification', async({request})=>{

    //authentification using UI example
   /* await page.goto('https://conduit.bondaracademy.com/')
    await page.getByText('Sign In').click()
    await page.getByRole('textbox', {name: "Email"}).fill('blandino@test.com')
    await page.getByRole('textbox', {name: "Password"}).fill('1111')
    await page.getByRole('button').click()
    await page.waitForTimeout(1000)

    await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags')
    await page.context().storageState({path: authFile})*/

    const responce = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
          "user":{"email":"blandino@test.com","password":"1111"}
        }
      })
      const responceBody = await responce.json()
      const accessToken = responceBody.user.token

      user.origins[0].localStorage[0].value = accessToken
      fs.writeFileSync(authFile, JSON.stringify(user))

      process.env['ACCESS_TOKEN'] = accessToken
})