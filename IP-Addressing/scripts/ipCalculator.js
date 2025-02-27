document.getElementById('calculate').addEventListener('click', function () {
    if (document.body.classList.contains('ipv6')) {
        calculateIPv6Details();
    } else {
        calculateIPDetails();
    }
});

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

//IPV6 SEction BElow

function calculateIPv6Details() {
    const ip = document.getElementById('ip').value;
    const prefix = document.getElementById('subnet').value;

    if (!validateIPv6(ip) || !validateIPv6Prefix(prefix)) {
        alert('Please enter a valid IPv6 address and prefix length.');
        return;
    }

    const networkAddress = calculateIPv6Network(ip, prefix);
    const firstUsableAddress = calculateIPv6FirstUsable(networkAddress);
    const lastUsableAddress = calculateIPv6LastUsable(networkAddress, prefix);

    const resultsTable = document.getElementById('resultsTable');
    const resultsTbody = resultsTable.getElementsByTagName('tbody')[0];

    // Show table with animation
    resultsTable.classList.remove('hidden');
    resultsTable.offsetHeight; // Force reflow
    resultsTable.classList.add('fade-in', 'table-show');

    resultsTbody.innerHTML = `
        <tr>
            <td>IPv6 Address</td>
            <td>${expandIPv6(ip)}</td>
        </tr>
        <tr>
            <td>Prefix Length</td>
            <td>${prefix}</td>
        </tr>
        <tr>
            <td>Network Address</td>
            <td>${networkAddress}/${prefix}</td>
        </tr>
        <tr>
            <td>First Usable Address</td>
            <td>${firstUsableAddress}</td>
        </tr>
        <tr>
            <td>Last Usable Address</td>
            <td>${lastUsableAddress}</td>
        </tr>
    `;
}

function validateIPv6(ip) {
    const regex = /^(?:(?:[a-fA-F\d]{1,4}:){7}[a-fA-F\d]{1,4}|(?=(?:[a-fA-F\d]{0,4}:){0,7}[a-fA-F\d]{0,4}$)(([0-9a-fA-F]{1,4}:){1,7}|:)((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
    return regex.test(ip);
}

function validateIPv6Prefix(prefix) {
    const prefixNum = parseInt(prefix);
    return !isNaN(prefixNum) && prefixNum >= 0 && prefixNum <= 128;
}

function expandIPv6(ip) {
    const parts = ip.split(':');
    const expandedParts = [];
    
    for (let i = 0; i < parts.length; i++) {
        if (parts[i] === '') {
            const missingParts = 8 - parts.length + 1;
            for (let j = 0; j < missingParts; j++) {
                expandedParts.push('0000');
            }
        } else {
            expandedParts.push(parts[i].padStart(4, '0'));
        }
    }
    
    return expandedParts.join(':');
}

function calculateIPv6Network(ip, prefix) {
    const expandedIP = expandIPv6(ip);
    const ipBits = expandedIP.replace(/:/g, '').split('').map(c => parseInt(c, 16).toString(2).padStart(4, '0')).join('');
    const networkBits = ipBits.slice(0, prefix).padEnd(128, '0');
    return networkBits.match(/.{1,16}/g).map(chunk => parseInt(chunk, 2).toString(16)).join(':');
}

function calculateIPv6FirstUsable(networkAddress) {
    const parts = networkAddress.split(':');
    parts[7] = (parseInt(parts[7], 16) + 1).toString(16).padStart(4, '0');
    return parts.join(':');
}

function calculateIPv6LastUsable(networkAddress, prefix) {
    const parts = networkAddress.split(':');
    const lastPart = parts[7];
    const lastBits = parseInt(lastPart, 16).toString(2).padStart(16, '0');
    const usableBits = lastBits.slice(0, prefix % 16).padEnd(16, '1');
    parts[7] = parseInt(usableBits, 2).toString(16).padStart(4, '0');
    return parts.join(':');
}


