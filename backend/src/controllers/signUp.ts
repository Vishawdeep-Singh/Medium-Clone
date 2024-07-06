import { Next, Context } from "hono"

import { z } from "zod"
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Jwt } from "hono/utils/jwt"

export const SignUp = async (c: Context) => {
    async function hashPassword(password: string, saltLength = 16, iterations = 100000, keyLength = 32): Promise<string> {
        // Generate a random salt
        const salt = crypto.getRandomValues(new Uint8Array(saltLength));

        // Convert password to ArrayBuffer
        const passwordBuffer = new TextEncoder().encode(password);

        // Import password as a key
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            passwordBuffer,
            'PBKDF2',
            false,
            ['deriveBits']
        );

        // Derive key using PBKDF2 with the salt and iterations
        const derivedKey = await crypto.subtle.deriveBits(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: iterations,
                hash: 'SHA-256'
            },
            keyMaterial,
            keyLength * 8 // keyLength in bits
        );

        // Convert derived key and salt to hexadecimal strings
        const derivedKeyHex = [...new Uint8Array(derivedKey)].map(b => b.toString(16).padStart(2, '0')).join('');
        const saltHex = [...salt].map(b => b.toString(16).padStart(2, '0')).join('');

        // Return combined salt and hash as a string
        return `${saltHex}$${derivedKeyHex}`;
    }
    try {
        const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate())
        const body: {

            email: string;
            name: string;
            password: string;
        } = await c.req.json();

        const hashedPassword: string = await hashPassword(body.password);
    
        const response = await prisma.user.create({
            data: {
                email: body.email,
                name: body.name,
                password: hashedPassword

            }
        })
        
        if (response !== null) {
            const token = await Jwt.sign({ id: response.id }, c.env.JWT_SECRET);
            if (token !== null || token !== undefined) {
                return c.json({
                    message: "Sign Up successfull",
                    token: token
                })
            }
        }


    } catch (error) {
        return c.json({
            message: "Error in creating User" + error
        },500)
    }
}



export const SignIn = async (c: Context) => {
    async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
        // Split stored hash into salt and hashed password parts
        const [storedSaltHex, storedDerivedKeyHex] = storedHash.split('$');

        // Convert stored salt back to Uint8Array
        const storedSalt = new Uint8Array((storedSaltHex.match(/.{1,2}/g) || []).map(byte => parseInt(byte, 16)));

        // Convert password to ArrayBuffer
        const passwordBuffer = new TextEncoder().encode(password);

        // Import password as a key
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            passwordBuffer,
            'PBKDF2',
            false,
            ['deriveBits']
        );

        // Derive key using PBKDF2 with the stored salt and same iterations and key length
        const derivedKey = await crypto.subtle.deriveBits(
            {
                name: 'PBKDF2',
                salt: storedSalt,
                iterations: 100000, // Same as in hashPassword function
                hash: 'SHA-256'
            },
            keyMaterial,
            32 * 8 // Same as in hashPassword function, keyLength in bits
        );

        // Convert derived key to hexadecimal string
        const derivedKeyHex = [...new Uint8Array(derivedKey)].map(b => b.toString(16).padStart(2, '0')).join('');

        // Compare derivedKeyHex with storedDerivedKeyHex
        return derivedKeyHex === storedDerivedKeyHex;
    }
    try {
        const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate())
        const body: {

            email: string;
            password: string;
        } = await c.req.json();

        const user = await prisma.user.findUnique({
            where: {
                email: body.email,


            }
        })
        if (user && user.password) {
            const isValid = await verifyPassword(body.password, user.password);
            if (isValid) {
                if (user != null) {
                    const token = await Jwt.sign({ id: user.id }, c.env.JWT_SECRET);
                    if (token != null || token != undefined) {
                        return c.json({
                            message: "Sign In successfull",
                            token: token
                        },200)
                    }
                }
            }
        }



        else {
            return c.json({
                message: "Either email/password is incorrect OR user does not exist"
            },400)
        }


    } catch (error) {
        return c.json({
            message: "Either email/password is incorrect OR user does not exist" + error
        },500)
    }
}