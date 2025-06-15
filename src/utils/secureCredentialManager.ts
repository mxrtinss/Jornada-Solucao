import { randomBytes, createCipheriv, createDecipheriv, createSign, createVerify, generateKeyPairSync, pbkdf2Sync } from 'crypto';

// --- Key Generation (for demo, in production store securely) ---
const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const aesKey = randomBytes(32); // 256 bits

// --- Password Hashing ---
function hashPassword(password: string, salt: Buffer): Buffer {
  return pbkdf2Sync(password, salt, 100_000, 32, 'sha512');
}

// --- Credential Document Creation ---
export function createEncryptedCredentialDocument(employees: Array<{ id: string, username: string, password: string }>) {
  // Prepare employee records with salt and hash
  const employeeRecords = employees.map(emp => {
    const salt = randomBytes(16);
    const passwordHash = hashPassword(emp.password, salt);
    return {
      id: emp.id,
      username: emp.username,
      salt: salt.toString('base64'),
      passwordHash: passwordHash.toString('base64'),
    };
  });

  // Encrypt the JSON
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', aesKey, iv);
  let encrypted = cipher.update(JSON.stringify(employeeRecords), 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const tag = cipher.getAuthTag();

  const payload = {
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    data: encrypted.toString('base64'),
  };

  // Sign the payload
  const sign = createSign('SHA256');
  sign.update(JSON.stringify(payload));
  sign.end();
  const signature = sign.sign(privateKey, 'base64');

  return {
    payload,
    signature,
  };
}

// --- Credential Validation ---
export function validateCredentialDocument(
  document: any,
  username: string,
  password: string
): boolean {
  try {
    // 1. Verify signature
    const verify = createVerify('SHA256');
    verify.update(JSON.stringify(document.payload));
    verify.end();
    const isValid = verify.verify(publicKey, document.signature, 'base64');
    if (!isValid) throw new Error('Signature validation failed');

    // 2. Decrypt
    const { iv, tag, data } = document.payload;
    const decipher = createDecipheriv('aes-256-gcm', aesKey, Buffer.from(iv, 'base64'));
    decipher.setAuthTag(Buffer.from(tag, 'base64'));
    let decrypted = decipher.update(Buffer.from(data, 'base64'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    const employeesDecrypted = JSON.parse(decrypted.toString('utf8'));

    // 3. Validate password
    const emp = employeesDecrypted.find((e: any) => e.username === username);
    if (!emp) return false;
    const hash = hashPassword(password, Buffer.from(emp.salt, 'base64'));
    return Buffer.compare(hash, Buffer.from(emp.passwordHash, 'base64')) === 0;
  } catch (err) {
    // Robust error handling
    console.error('Credential validation error:', err);
    return false;
  }
}

// --- Example Usage ---
if (require.main === module) {
  // Demo employees
  const employees = [
    { id: '1', username: 'alice', password: 'alicepass' },
    { id: '2', username: 'bob', password: 'bobpass' },
  ];

  // Create encrypted document
  const doc = createEncryptedCredentialDocument(employees);
  console.log('Encrypted & Signed Document:', JSON.stringify(doc, null, 2));

  // Validate credentials
  console.log('Validating alice/alicepass:', validateCredentialDocument(doc, 'alice', 'alicepass')); // true
  console.log('Validating bob/wrongpass:', validateCredentialDocument(doc, 'bob', 'wrongpass')); // false
} 