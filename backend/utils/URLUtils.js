class URLUtils {
  /**
   * Normalize a URL by adding protocol if missing
   * @param {string} url - The URL to normalize
   * @returns {string} - Normalized URL with protocol
   */
  static normalizeUrl(url) {
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL provided');
    }

    // Trim whitespace
    url = url.trim();

    // If URL already has protocol, return as is
    if (/^https?:\/\//i.test(url)) {
      return url;
    }

    // If URL starts with //, add https:
    if (/^\/\//.test(url)) {
      return `https:${url}`;
    }

    // If URL starts with www., add https://
    if (/^www\./i.test(url)) {
      return `https://${url}`;
    }

    // For all other cases, add https://
    return `https://${url}`;
  }

  /**
   * Validate URL format and accessibility
   * @param {string} url - The URL to validate
   * @returns {Object} - Validation result with isValid, normalizedUrl, and error
   */
  static async validateUrl(url) {
    try {
      const normalizedUrl = this.normalizeUrl(url);
      
      // Test URL constructor
      const urlObj = new URL(normalizedUrl);
      
      // Check if it's a valid domain format
      if (!this.isValidDomain(urlObj.hostname)) {
        return {
          isValid: false,
          normalizedUrl,
          error: 'Invalid domain format'
        };
      }

      return {
        isValid: true,
        normalizedUrl,
        domain: urlObj.hostname,
        protocol: urlObj.protocol
      };
    } catch (error) {
      return {
        isValid: false,
        normalizedUrl: url,
        error: error.message
      };
    }
  }

  /**
   * Check if domain format is valid
   * @param {string} domain - Domain to validate
   * @returns {boolean} - True if valid domain
   */
  static isValidDomain(domain) {
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return domainRegex.test(domain);
  }

  /**
   * Extract domain info from URL
   * @param {string} url - URL to analyze
   * @returns {Object} - Domain information
   */
  static extractDomainInfo(url) {
    try {
      const normalizedUrl = this.normalizeUrl(url);
      const urlObj = new URL(normalizedUrl);
      
      return {
        domain: urlObj.hostname,
        subdomain: this.getSubdomain(urlObj.hostname),
        rootDomain: this.getRootDomain(urlObj.hostname),
        protocol: urlObj.protocol,
        port: urlObj.port,
        pathname: urlObj.pathname
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Get subdomain from hostname
   * @param {string} hostname - The hostname
   * @returns {string} - Subdomain or empty string
   */
  static getSubdomain(hostname) {
    const parts = hostname.split('.');
    if (parts.length > 2) {
      return parts.slice(0, -2).join('.');
    }
    return '';
  }

  /**
   * Get root domain from hostname
   * @param {string} hostname - The hostname
   * @returns {string} - Root domain
   */
  static getRootDomain(hostname) {
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      return parts.slice(-2).join('.');
    }
    return hostname;
  }

  /**
   * Check if URL is likely an internal/private URL
   * @param {string} url - URL to check
   * @returns {boolean} - True if likely internal
   */
  static isLikelyInternalUrl(url) {
    try {
      const normalizedUrl = this.normalizeUrl(url);
      const urlObj = new URL(normalizedUrl);
      const hostname = urlObj.hostname.toLowerCase();

      // Check for localhost
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return true;
      }

      // Check for private IP ranges
      if (this.isPrivateIP(hostname)) {
        return true;
      }

      // Check for common internal domains
      const internalPatterns = [
        /\.local$/,
        /\.internal$/,
        /\.corp$/,
        /\.intranet$/,
        /^192\.168\./,
        /^10\./,
        /^172\.(?:1[6-9]|2[0-9]|3[01])\./
      ];

      return internalPatterns.some(pattern => pattern.test(hostname));
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if hostname is a private IP
   * @param {string} hostname - Hostname to check
   * @returns {boolean} - True if private IP
   */
  static isPrivateIP(hostname) {
    const ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = hostname.match(ipRegex);
    
    if (!match) return false;
    
    const [, a, b, c, d] = match.map(Number);
    
    // Check private IP ranges
    return (
      (a === 10) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 127) // localhost
    );
  }
}

module.exports = URLUtils;
