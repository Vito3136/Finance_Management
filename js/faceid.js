/**
 * Face ID / WebAuthn Biometric Authentication Module
 * Provides seamless, hardware-backed Face ID / Touch ID / Passkey authentication
 * using WebAuthn Platform Authenticator and Web Crypto AES-GCM 256.
 */

export async function isFaceIdAvailable() {
    try {
        if (!window.PublicKeyCredential || !navigator.credentials) return false;
        if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable !== 'function') return false;
        return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch (e) {
        return false;
    }
}

export function isFaceIdEnrolled() {
    return !!(localStorage.getItem('faceid_cred_id') && localStorage.getItem('faceid_bundle'));
}

export function getEnrolledEmail() {
    return localStorage.getItem('faceid_email') || '';
}

function bufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

function base64ToBuffer(base64) {
    const pad = '='.repeat((4 - (base64.length % 4)) % 4);
    const b64 = (base64 + pad).replace(/-/g, '+').replace(/_/g, '/');
    const raw = atob(b64);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
        bytes[i] = raw.charCodeAt(i);
    }
    return bytes.buffer;
}

async function deriveKey(credentialId, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        enc.encode(credentialId),
        'PBKDF2',
        false,
        ['deriveKey']
    );

    return window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}

async function encryptData(credentialId, dataObj) {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(credentialId, salt);
    
    const encoded = new TextEncoder().encode(JSON.stringify(dataObj));
    const ciphertext = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encoded
    );

    return {
        salt: bufferToBase64(salt),
        iv: bufferToBase64(iv),
        ciphertext: bufferToBase64(ciphertext)
    };
}

async function decryptData(credentialId, encryptedBundle) {
    const salt = new Uint8Array(base64ToBuffer(encryptedBundle.salt));
    const iv = new Uint8Array(base64ToBuffer(encryptedBundle.iv));
    const ciphertext = base64ToBuffer(encryptedBundle.ciphertext);
    const key = await deriveKey(credentialId, salt);

    const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        ciphertext
    );

    return JSON.parse(new TextDecoder().decode(decrypted));
}

export async function registerFaceId(email, password) {
    const challenge = window.crypto.getRandomValues(new Uint8Array(32));
    const userId = window.crypto.getRandomValues(new Uint8Array(16));

    const creationOptions = {
        challenge: challenge,
        rp: {
            name: "Finance Management"
        },
        user: {
            id: userId,
            name: email || "vito@ditrani.finance",
            displayName: email ? email.split('@')[0] : "Vito"
        },
        pubKeyCredParams: [
            { alg: -7, type: "public-key" },  // ES256
            { alg: -257, type: "public-key" } // RS256
        ],
        authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
            residentKey: "preferred"
        },
        timeout: 60000,
        attestation: "none"
    };

    const credential = await navigator.credentials.create({
        publicKey: creationOptions
    });

    if (!credential || !credential.id) {
        throw new Error("Registrazione biometrica non riuscita.");
    }

    const credId = credential.id;
    const encryptedBundle = await encryptData(credId, { email, password });

    localStorage.setItem('faceid_cred_id', credId);
    localStorage.setItem('faceid_bundle', JSON.stringify(encryptedBundle));
    localStorage.setItem('faceid_email', email);

    return true;
}

export async function authenticateWithFaceId() {
    const credId = localStorage.getItem('faceid_cred_id');
    const bundleStr = localStorage.getItem('faceid_bundle');
    if (!credId || !bundleStr) {
        throw new Error("Face ID non configurato su questo dispositivo.");
    }

    const bundle = JSON.parse(bundleStr);
    const challenge = window.crypto.getRandomValues(new Uint8Array(32));

    const requestOptions = {
        challenge: challenge,
        allowCredentials: [{
            id: base64ToBuffer(credId),
            type: "public-key"
        }],
        userVerification: "required",
        timeout: 60000
    };

    const assertion = await navigator.credentials.get({
        publicKey: requestOptions
    });

    if (!assertion) {
        throw new Error("Verifica biometrica annullata o fallita.");
    }

    const credentials = await decryptData(credId, bundle);
    return credentials;
}

export function removeFaceId() {
    localStorage.removeItem('faceid_cred_id');
    localStorage.removeItem('faceid_bundle');
    localStorage.removeItem('faceid_email');
}
