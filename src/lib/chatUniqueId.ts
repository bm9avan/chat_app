// Simple FNV-1a hash function
function fnv1aHash(id: string): number {
  let hash = 2166136261; // 32-bit FNV offset basis
  for (let i = 0; i < id.length; i++) {
    hash ^= id.charCodeAt(i);
    hash +=
      (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0; // Convert to unsigned 32-bit integer
}

// Function to generate a unique ID by combining multiple hashes
export default function chatUniqueId(id1: string, id2: string): string {
  const hash1 = fnv1aHash(id1);
  const hash2 = fnv1aHash(id2);

  // Combine hashes to minimize collision risk
  if (hash1 > hash2) {
    const combinedHash = `${hash1}-${hash2}`;

    // Generate a final hash of the combined string
    const finalHash = fnv1aHash(combinedHash);

    // Convert the final hash to a hexadecimal string
    return finalHash.toString(16);
  } else {
    const combinedHash = `${hash2}-${hash1}`;
    const finalHash = fnv1aHash(combinedHash);
    return finalHash.toString(16);
  }
}
