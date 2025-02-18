document.getElementById('calculate').addEventListener('click', calculateIPDetails);

function calculateIPDetails() {
    const ip = document.getElementById('ip').value;
    const subnet = document.getElementById('subnet').value;

    if (!validateIP(ip) || (!validateSubnetMask(subnet) && !validateCIDR(subnet))) {
        alert('Please enter a valid IP address and subnet mask.');
        return;
    }

    const subnetBinary = validateCIDR(subnet) ? cidrToBinary(subnet) : toBinary(subnet);
    const ipBinary = toBinary(ip);
    const networkBinary = calculateNetwork(ipBinary, subnetBinary);
    const broadcastBinary = calculateBroadcast(networkBinary, subnetBinary);
    const wildcardBinary = calculateWildcard(subnetBinary);
    const hostMinBinary = calculateHostMin(networkBinary);
    const hostMaxBinary = calculateHostMax(broadcastBinary);
    const subnetDecimal = validateCIDR(subnet) ? toDecimal(subnetBinary) : subnet;
    const cidr = validateCIDR(subnet) ? subnet : decimalToCIDR(subnet);
    const networkDecimal = `${toDecimal(networkBinary)} / ${cidr}`;
    const hostsCount = calculateHostsCount(cidr);

    const resultsTable = document.getElementById('resultsTable');
    const resultsTbody = resultsTable.getElementsByTagName('tbody')[0];

    // Show table with animation
    resultsTable.classList.remove('hidden');
    
    // Force reflow for transition to work
    resultsTable.offsetHeight;
    
    resultsTable.classList.add('fade-in', 'table-show');

    resultsTbody.innerHTML = `
        <tr>
            <td>IP Address</td>
            <td>${ip}</td>
            <td>${ipBinary}</td>
        </tr>
        <tr>
            <td>Subnet Mask</td>
            <td>${subnetDecimal} = ${cidr}</td>
            <td>${subnetBinary}</td>
        </tr>
        <tr>
            <td>Wildcard Mask</td>
            <td>${toDecimal(wildcardBinary)}</td>
            <td>${wildcardBinary}</td>
        </tr>
        <tr>
            <td>Network Address</td>
            <td>${networkDecimal}</td>
            <td>${networkBinary}</td>
        </tr>
        <tr>
            <td>Broadcast Address</td>
            <td>${toDecimal(broadcastBinary)}</td>
            <td>${broadcastBinary}</td>
        </tr>
        <tr>
            <td>First Usable Host</td>
            <td>${toDecimal(hostMinBinary)}</td>
            <td>${hostMinBinary}</td>
        </tr>
        <tr>
            <td>Last Usable Host</td>
            <td>${toDecimal(hostMaxBinary)}</td>
            <td>${hostMaxBinary}</td>
        </tr>
        <tr>
            <td>Available Hosts</td>
            <td>${hostsCount}</td>
            <td></td>
        </tr>
    `;
}

function validateIP(ip) {
    const octets = ip.split('.');
    return octets.length === 4 && octets.every(octet => octet >= 0 && octet <= 255);
}

function validateSubnetMask(mask) {
    const octets = mask.split('.');
    return octets.length === 4 && octets.every(octet => octet >= 0 && octet <= 255);
}

function validateCIDR(mask) {
    const cidr = parseInt(mask);
    return !isNaN(cidr) && cidr >= 0 && cidr <= 32;
}

function cidrToBinary(cidr) {
    const cidrNumber = parseInt(cidr);
    const binaryMask = '1'.repeat(cidrNumber).padEnd(32, '0');
    return `${binaryMask.slice(0, 8)}.${binaryMask.slice(8, 16)}.${binaryMask.slice(16, 24)}.${binaryMask.slice(24)}`;
}

function toBinary(ip) {
    return ip.split('.').map(octet => parseInt(octet).toString(2).padStart(8, '0')).join('.');
}

function toDecimal(binary) {
    return binary.split('.').map(bin => parseInt(bin, 2)).join('.');
}

function decimalToCIDR(subnet) {
    const binaryMask = toBinary(subnet).replace(/\./g, '');
    const cidr = binaryMask.indexOf('0');
    return cidr === -1 ? 32 : cidr;
}

function calculateNetwork(ipBinary, subnetBinary) {
    const ipOctets = ipBinary.split('.');
    const subnetOctets = subnetBinary.split('.');
    return ipOctets.map((octet, i) => (parseInt(octet, 2) & parseInt(subnetOctets[i], 2)).toString(2).padStart(8, '0')).join('.');
}

function calculateBroadcast(networkBinary, subnetBinary) {
    const networkOctets = networkBinary.split('.');
    const wildcardBinary = calculateWildcard(subnetBinary);
    const wildcardOctets = wildcardBinary.split('.');
    return networkOctets.map((octet, i) => (parseInt(octet, 2) | parseInt(wildcardOctets[i], 2)).toString(2).padStart(8, '0')).join('.');
}

function calculateWildcard(subnetBinary) {
    return subnetBinary.split('.').map(octet => (~parseInt(octet, 2) & 255).toString(2).padStart(8, '0')).join('.');
}

function calculateHostMin(networkBinary) {
    const networkOctets = networkBinary.split('.');
    networkOctets[3] = (parseInt(networkOctets[3], 2) + 1).toString(2).padStart(8, '0');
    return networkOctets.join('.');
}

function calculateHostMax(broadcastBinary) {
    const broadcastOctets = broadcastBinary.split('.');
    broadcastOctets[3] = (parseInt(broadcastOctets[3], 2) - 1).toString(2).padStart(8, '0');
    return broadcastOctets.join('.');
}

function calculateHostsCount(cidr) {
    return Math.pow(2, 32 - cidr) - 2;
}

document.getElementById('toDecimal').addEventListener('click', () => {
    const binary = document.getElementById('binary').value;
    const decimalResult = document.getElementById('decimalResult');
    decimalResult.textContent = toDecimal(binary);
});

document.getElementById('toBinary').addEventListener('click', () => {
    const decimal = document.getElementById('decimal').value;
    const binaryResult = document.getElementById('binaryResult');
    binaryResult.textContent = toBinary(decimal);
});
