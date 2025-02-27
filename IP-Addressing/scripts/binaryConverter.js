document.getElementById('toDecimal').addEventListener('click', () => {
    const binary = document.getElementById('binary').value;
    if (!/^[01]+$/.test(binary)) {
        return;
    }
    const decimal = parseInt(binary, 2);
    document.getElementById('decimalResult').innerText = `Decimal: ${decimal}`;
});

document.getElementById('toBinary').addEventListener('click', () => {
    const decimal = document.getElementById('decimal').value;
    if (!/^\d+$/.test(decimal) || decimal > 255) {
        return;
    }
    const binary = parseInt(decimal).toString(2).padStart(8, '0');
    document.getElementById('binaryResult').innerText = `Binario: ${binary}`;
});

//IPv6 BElow

document.getElementById('convertIPv6').addEventListener('click', () => {
    const ipv6 = document.getElementById('ipv6Address').value.trim();
    
    console.log("Input IPv6:", ipv6); // Debugging: Log input

    if (!/^[0-9a-fA-F:]+$/.test(ipv6)) {
        console.error("Invalid IPv6 address format");
        return;
    }

    const expandedIPv6 = expandIPv6(ipv6);
    console.log("Expanded IPv6:", expandedIPv6); // Debugging: Log expanded address

    if (!expandedIPv6) {
        console.error("Failed to expand IPv6 address");
        return;
    }

    const binaryIPv6 = ipv6ToBinary(expandedIPv6);
    console.log("IPv6 in Binary:", binaryIPv6); // Debugging: Log binary format

    document.getElementById('ipv6BinaryResult').innerText = `Binary: ${binaryIPv6}`;
});


function ipv6ToBinary(ipv6) {
    return ipv6.split(':')
        .map(hextet => parseInt(hextet, 16).toString(2).padStart(16, '0'))
        .join(':');
}


// Function to expand shorthand IPv6 notation (:: notation)
function expandIPv6(ipv6) {
    let parts = ipv6.split(':');
    let missing = 8 - parts.filter(part => part.length > 0).length;

    if (ipv6.includes('::')) {
        ipv6 = ipv6.replace('::', ':' + '0:'.repeat(missing));
    }

    return ipv6.split(':').map(part => part.padStart(4, '0')).join(':');
}
