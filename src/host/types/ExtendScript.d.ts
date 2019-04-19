// Type declarations for ExtendScript Built-in types
// Initial declarations by: Eric Robinson <eric@sonicbloom.io>

/**
 * The base class of all JavaScript objects.
 */
interface Object {
    /**
     * Points to the constructor function that created this object.
     * Note that this property is treated as an XML element in the XML class.
     */
    constructor: Function;

    /**
     * Retrieves and returns the Reflection object associated with this method or a property.
     * Note that this property is treated as an XML element in the XML class.
     */
    reflect: Reflection;

    /**
     * Creates and returns a string representation of this object.
     * This function serializes the object, so that it can, for example, be passed between engines. Pass the returned string back to eval() to recreate the object. Works only with built-in classes.
     */
    toSource(): string;

    /**
     * Many objects (such as Date) override this method in favor of their own implementation. If an object has no string value and no user-defined toString() method, the default method returns [object type], where "type" is the object type or the name of the constructor function that created the object.
     */
    toString(): string;

    /**
     * Removes the watch function of a property.
     * @param name The name of the property to unwatch.
     */
    unwatch(name: string): void;

    /**
     * If the object has no primitive value, returns the object itself.  Note that you rarely need to call this method yourself.  The JavaScript interpreter automatically invokes it when encountering an object where a primitive value is expected.
     */
    valueOf(): Object;

    /**
     * Adds a watch function to a property, which is called when the value changes.
     * This function can accept, modify, or reject a new value that the user, application, or a script has attempted to place in a property.
     * @param name The name of the property to watch.
     * @param func The function to be called when the value of this property changes.
     * This function must three arguments, and return as its result the value to be stored in the property. The arguments are:
     *      name: the name of the property that changes.
     *      oldValue: the old property value.
     *      newValue: the new property value that was specified.
     */
    watch(name: string, func: Function): void;
}

interface ObjectConstructor {
    /**
     * Note that this property is treated as an XML element in the XML class.
     */
    readonly prototype: Object;

    /**
     * Reports whether an object is still valid.
     * @param what The object to check.
     */
    isValid(what: Object): boolean;
}

/**
 * The $ object provides a number of debugging facilities and informational methods.
 */
declare const $: Helper;

interface Helper extends Object {
    /**
     * The ExtendScript build information.
     */
    readonly build: string;
    /**
     * The ExtendScript build date.
     */
    readonly buildDate: Date;
    /**
     * The character used as the decimal point character in formatted numeric output.
     */
    decimalPoint: string;
    /**
     * The name of the current ExtendScript engine, if set.
     */
    readonly engineName: string;
    /**
     * The most recent run-time error information.
     * Assigning error text to this property generates a run-time error; however, the preferred way to generate a run-time error is to throw an {Error} object.
     */
    error: Error;
    /**
     * The file name of the current script.
     */
    readonly fileName: string;
    /**
     * Gets or sets low-level debug output flags.
     * A logical AND of bit flag values:
     *  - 0x0002 (2): Displays each line with its line number as it is executed.
     *  - 0x0040 (64): Enables excessive garbage collection. Usually, garbage collection starts when the number of objects has increased by a certain amount since the last garbage collection. This flag causes ExtendScript to garbage collect after almost every statement. This impairs performance severely, but is useful when you suspect that an object gets released too soon.
     *  - 0x0080 (128): Displays all calls with their arguments and the return value.
     *  - 0x0100 (256): Enables extended error handling (@see strict). 
     *  - 0x0200 (512): Enables the localization feature of the toString method. Equivalent to the localize property.
     */
    flags: number;
    /**
     * A reference to the global object, which contains the JavaScript global namespace.
     */
    readonly global: Object;
    /**
     * A high-resolution timer, measuring the time in microseconds. The timer starts when ExtendScript is initialized during the application startup sequence. Every read access resets the timer to Zero.
     */
    readonly hiresTimer: number;
    /**
     * The path for include files for the current script.
     */
    readonly includePath: string;
    /**
     * The current debugging level, which enables or disables the JavaScript debugger.
     * One of:
     *  - 0 (no debugging),
     *  - 1 (break on runtime errors),
     *  - or 2 (full debug mode).
     */
    level: number;
    /**
     * The current line number of the currently executing script.
     */
    readonly line: number;
    /**
     * Gets or sets the current locale.
     * The string contains five characters in the form LL_RR, where LL is an ISO 639 language specifier, and RR is an ISO 3166 region specifier. 
     * Initially, this is the value that the application or the platform returns for the current user. You can set it to temporarily change the locale for testing. To return to the application or platform setting, set to undefined, null, or the empty string.
     */
    locale: string;
    /**
     * Set to true to enable the extended localization features of the built-in toString() method.
     */
    localize: boolean;
    /**
     * The ExtendScript memory cache size, in bytes.
     */
    memCache: number;
    /**
     * The current operating system version information.
     * @example
     * // Result: Windows XP 5.1 Service Pack 2 
     * $.os 
     */
    readonly os: string;
    /**
     * An {ScreenObject} array containing information about the display screens attached to your computer.
     */
    readonly screens: Array<ScreenObject>;
    /**
     * The current stack trace.
     */
    readonly stack: string;
    /**
     * Sets or clears strict mode for object modification.
     * When true, any attempt to write to a read-only property causes a runtime error. Some objects do not permit the creation of new properties when true.
     */
    strict: boolean;
    /**
     * The version number of the ExtendScript engine.
     * Formatted as a three-part number and description; for example: "3.92.95 (debug)".
     */
    readonly version: string;

    /**
     * Shows an About box for the ExtendScript component, and returns
     * the text for the box.
     */
    about(): string;
    /**
     * Breaks execution at the current position.
     * @param condition A string containing a JavaScript statement to be used as a condition. If the statement evaluates to true or nonzero when this point is reached, execution stops.
     */
    bp(condition?: any): void;
    /**
     * Invokes the platform-specific color selection dialog, and returns the selected color.
     * @param color The color to be preselected in the dialog, as 0xRRGGBB, or -1 for the platform default.
     */
    colorPicker(color: number): number;
    /**
     * Loads and evaluates a file.
     * @param file The file to load.
     * @param timeout An optional timeout in milliseconds.
     */
    evalFile(file: File, timeout?: number): any;
    /**
     * Initiates garbage collection in the ExtendScript engine.
     */
    gc(): void;
    /**
     * Retrieves the value of an environment variable.
     * @param name The name of the variable.
     */
    getEnv(name: string): string;
    /**
     * Sets the value of an environment variable.
     * @param name The name of the variable.
     * @param value The value of the variable.
     */
    setEnv(name: string, value: string): void;
    /**
     * Suspends the calling thread for a number of milliseconds.
     * During a sleep period, checks at 100 millisecond intervals to see whether the sleep should be terminated. This can happen if there is a break request, or if the script timeout has expired.
     * @param msecs Number of milliseconds to sleep.
     */
    sleep(msecs: number): void;
    /**
     * Converts this object to a string.
     */
    toString(): string;
    /**
     * Prints text to the Console.
     * @param text The text to print. All arguments are concatenated.
     */
    write(text: any): void;
    /**
     * Prints text to the Console, and adds a newline character.
     * @param text - The text to print. All arguments are concatenated.
     */
    writeln(text: any): void;
}

/**
 * Provides information about a class.
 */
declare class Reflection extends Object {
    /**
     * The long description text.
     */
    readonly description: string;

    /**
     * The short description text.
     */
    readonly help: string;

    /**
     * An array of method descriptions.
     */
    readonly methods: ReflectionInfo[];

    /**
     * The class name.
     */
    readonly name: string;

    /**
     * An array of property descriptions.
     */
    readonly properties: ReflectionInfo[];

    /**
     * Sample code, if present.
     */
    readonly sampleCode: string;

    /**
     * A file containing sample code. May be null.
     */
    readonly sampleFile: File;

    /**
     * An array of class method descriptions.
     */
    readonly staticMethods: ReflectionInfo[];

    /**
     * An array of class property descriptions.
     */
    readonly staticProperties: ReflectionInfo[];

    /**
     * Finds an element description by name.
     * @param name The name of the element to find.
     */
    find(name: string): ReflectionInfo;

    /**
     * Returns this class information as XML in OMV format.
     */
    toXML(): XML;
}

// Consider this for the ReflectionInfo.type parameter's type annotation:
// type ReflectionInfoTypeOption = "unknown" | "readonly" | "readwrite" | "createonly" | "method" | "parameter";

/**
 * Provides information about a method, a property or a method parameters.
 */
declare class ReflectionInfo extends Object {
    /**
     * The description of method or function arguments.
     */
    readonly arguments: ReflectionInfo[];

    /**
     * The data type.
     */
    readonly dataType: string;

    /**
     * The default value.
     */
    readonly defaultValue: any;

    /**
     * The long description text.
     */
    readonly description: string;

    /**
     * The short description text.
     */
    readonly help: string;

    /**
     * Contains true if the class describes a collection class.
     */
    readonly isCollection: boolean;

    /**
     * The maximum value.
     */
    readonly max: number;

    /**
     * The minimum value.
     */
    readonly min: number;

    /**
     * The element name.
     */
    readonly name: string;

    /**
     * The class object that this element belongs to.
     */
    readonly parent: Reflection;

    /**
     * Sample code, if present.
     */
    readonly sampleCode: string;

    /**
     * A file containing sample code. May be null.
     */
    readonly sampleFile: File;

    /**
     * The element type.
     * One of unknown, readonly, readwrite, createonly, method or parameter.
     */
    readonly type: string;
}

declare class ScreenObject extends Object {
    /**
     * Pixel position of the left side of the screen in global coordinates.
     */
    readonly left: number;
    /**
     * Pixel position of the top side of the screen in global coordinates.
     */
    readonly top: number;
    /**
     * Pixel position of the right side of the screen in global coordinates.
     */
    readonly right: number;
    /**
     * Pixel position of the bottom side of the screen in global coordinates.
     */
    readonly bottom: number;

    /**
     * True if the screen describes the primary display.
     */
    readonly primary: boolean;
}

/**
 * Represents a file in the local file system in a platform-independent manner.
 */
declare class File {
	/**
	 * The full path name for the referenced file in URI notation.
	 */
    readonly absoluteURI: string;

	/**
	 * If true, the object refers to a file system alias or shortcut.
	 */
    readonly alias: boolean;

	/**
	 * The creation date of the referenced file, or null if the object does not refer to a file on disk.
	 */
    readonly created: Date;

	/**
	 * In Mac OS, the file creator as a four-character string. In Windows or UNIX, value is "????".
	 */
    readonly creator: string;

	/**
	 * The localized name of the referenced file, without the path specification.
	 */
    readonly displayName: string;

	/**
	 * Gets or sets the encoding for subsequent read/write operations.
	 * One of the encoding constants listed in the JavaScript Tools Guide. If the value is not recognized, uses the system default encoding.A special encoder, BINARY, is used to read binary files. It stores each byte of the file as one Unicode character regardless of any encoding. When writing, the lower byte of each Unicode character is treated as a single byte to write.
	 */
    encoding: string;

	/**
	 * When true, a read attempt caused the current position to be at the end of the file, or the file is not open.
	 */
    readonly eof: boolean;

	/**
	 * A string containing a message describing the most recent file system error.
	 * Typically set by the file system, but a script can set it. Setting this value clears any error message and resets the error bit for opened files. Contains the empty string if there is no error.
	 */
    error: string;

	/**
	 * If true, this object refers to a file or file-system alias that actually exists in the file system.
	 */
    readonly exists: boolean;

	/**
	 * The name of the file system.
	 * This is a class property accessed through the File constructor. Valid values are "Windows", "Macintosh", and "Unix".
	 */
    static readonly fs: string;

	/**
	 * The platform-specific full path name for the referenced file.
	 */
    readonly fsName: string;

	/**
	 * The full path name for the referenced file in URI notation.
	 */
    readonly fullName: string;

	/**
	 * When true, the file is not shown in the platform-specific file browser.
	 * If the object references a file-system alias or shortcut, the flag is altered on the alias, not on the original file.
	 */
    hidden: boolean;

	/**
	 * The size of the file in bytes.
	 * Can be set only for a file that is not open, in which case it truncates or pads the file with 0-bytes to the new length.
	 */
    length: number;

	/**
	 * How line feed characters are written in the file system.
	 * One of the values "Windows", "Macintosh", or "Unix".
	 */
    lineFeed: string;

	/**
	 * The date of the referenced file's last modification, or null if the object does not refer to a file on the disk.
	 */
    readonly modified: Date;

	/**
	 * The file name portion of the absolute URI for the referenced file, without the path specification.
	 */
    readonly name: string;

	/**
	 * The Folder object for the folder that contains this file.
	 */
    readonly parent: Folder;

	/**
	 * The path portion of the absolute URI for the referenced file, without the file name.
	 */
    readonly path: string;

	/**
	 * When true, prevents the file from being altered or deleted.
	 * If the referenced file is a file-system alias or shortcut, the flag is altered on the alias, not on the original file.
	 */
    readonly: boolean;

	/**
	 * The path name for the object in URI notation, relative to the current folder.
	 */
    readonly relativeURI: string;

	/**
	 * The file type as a four-character string.
	 * In Mac OS, the Mac OS file type.
	 * In Windows, "appl" for .EXE files, "shlb" for .DLL files and "TEXT" for any other file.
	 */
    readonly type: string;

	/**
	 * Creates and returns a new File object referring to a given file system location.
	 * @param path The full or partial path name of the file,in platform-specific or URI format. The value stored in the object is the absolute path. The file that the path refers to does not need to exist.If the path refers to an existing folder: The File function returns a Folder object instead of a File object. The new operator returns a File object for a nonexisting file with the same name.
	 */
    constructor(path?: string);

	/**
	 * Changes the path specification of the referenced file.
	 * @param path A string containing the new path, absolute or relative to the current folder.
	 */
    changePath(path: string): boolean;

	/**
	 * Closes this open file.
	 * Returns true if the file was closed successfully, false if an I/O error occurred.
	 */
    close(): boolean;

	/**
	 * Copies this object’s referenced file to the specified target location.
	 * Resolves any aliases to find the source file. If a file exists at the target location, it is overwritten.
	 * Returns true if the copy was successful.
	 * @param target A string with the URI path to the target location, or a File object that references the target location.
	 */
    copy(target: string): boolean;

	/**
	 * Makes this file a file-system alias or shortcut to the specified file.
	 * The referenced file for this object must not yet exist on disk. Returns true if the operation was successful.
	 * @param path A string containing the path of the target file.
	 */
    createAlias(path: string): void;

	/**
	 * Decodes a UTF-8 encoded string as required by RFC 2396, and returns the decoded string.
	 * See also String.decodeURI().
	 * @param uri The UTF-8 encoded string to decode.
	 */
    static decode(uri: string): string;

	/**
	 * Encodes a string as required by RFC 2396, and returns the encoded string.
	 * All special characters are encoded in UTF-8 and stored as escaped characters starting with the percent sign followed by two hexadecimal digits. For example, the string "my file" is encoded as "my%20file".
	 * Special characters are those with a numeric value greater than 127, except the following: / - _ . ! ~ * ' ( )
	 * See also encodeURI().
	 * @param name The string to encode.
	 */
    static encode(name: string): string;

	/**
	 * Executes or opens this file using the appropriate application, as if it had been double-clicked in a file browser.
	 * You can use this method to run scripts, launch applications, and so on.Returns true immediately if the application launch was successful.
	 */
    execute(): boolean;

	/**
	 * Retrieves and returns the path for this file, relative to the specified base path, in URI notation.
	 * If no base path is supplied, the URI is relative to the path of the current folder.Returns a string containing the relative URI.
	 * @param basePath A base path in URI notation.
	 */
    getRelativeURI(basePath: string): string;

	/**
	 * Reports whether a given encoding is available.
	 * @param name The encoding name. Typical values are "ASCII", "binary", or "UTF-8".For a complete list of supported encodings, see the JavaScript Tools Guide.
	 */
    static isEncodingAvailable(name: string): boolean;

	/**
	 * Opens the referenced file for subsequent read/write operations. The method resolves any aliases to find the file.
	 * Returns true if the file was opened successfully.The method attempts to detect the encoding of the open file. It reads a few bytes at the current location and tries to detect the Byte Order Mark character 0xFFFE. If found, the current position is advanced behind the detected character and the encoding property is set to one of the strings UCS-2BE, UCS-2LE, UCS4-BE, UCS-4LE, or UTF-8. If the marker character is not found, it checks for zero bytes at the current location and makes an assumption about one of the above formats (except UTF-8). If everything fails, the encoding property is set to the system encoding.
	 * IMPORTANT: Be careful about opening a file more than once. The operating system usually permits you to do so, but if you start writing to the file using two different File objects, you can destroy your data.
	 * @param mode The read-write mode, a single-character string. One of these characters: r (read) Opens for reading. If the file does not exist or cannot be found, the call fails. w (write) Opens a file for writing. If the file exists, its contents are destroyed. If the file does not exist, creates a new, empty file. e (edit) Opens an existing file for reading and writing. a (append) Opens an existing file for reading and writing, and moves the current position to the end of the file.
	 * @param type In Mac OS, the type of a newly created file, a 4-character string. Ignored in Windows and UNIX.
	 * @param creator In Mac OS, the creator of a newly created file, a 4-character string. Ignored in Windows and UNIX.
	 */
    open(mode: string, type?: string, creator?: string): boolean;

	/**
	 * Opens a dialog so the user can select one or more files to open.
	 * Opens the built-in platform-specific file-browsing dialog in which a user can select an existing file or multiple files, and creates new File objects to represent the selected files.
	 * If the user clicks OK, returns a File object for the selected file, or an array of objects if multiple files are selected.
	 * If the user cancels, returns null.
	 * @param prompt The prompt text, displayed if the dialog allows a prompt.
	 * @param filter A filter that limits the types of files displayed in the dialog. In Windows,a filter expression such as "Javascript files:*.jsx;All files:*.*". In Mac OS, a filter function that takes a File instance and returns true if the file should be included in the display, false if it should not.
	 * @param multiSelect When true, the user can select multiple files and the return value is an array.
	 */
    static openDialog(prompt: string, filter?: any, multiSelect?: boolean): File;

	/**
	 * Opens the built-in platform-specific file-browsing dialog, in which the user can select an existing file or files, and creates new File objects to represent the selected files.
	 * Differs from the class method openDialog() in that it presets the current folder to this File object’s parent folder and the current file to this object’s associated file.
	 * If the user clicks OK, returns a File or Folder object for the selected file or folder, or an array of objects.
	 * If the user cancels, returns null.
	 * @param prompt A string containing the prompt text, if the dialog allows a prompt.
	 * @param filter A filter that limits the types of files displayed in the dialog. In Windows,a filter expression such as "Javascript files:*.jsx;All files:*.*". In Mac OS, a filter function that takes a File instance and returns true if the file should be included in the display, false if it should not.
	 * @param multiSelect When true, the user can select multiple files and the return value is an array.
	 */
    openDlg(prompt: string, filter?: any, multiSelect?: boolean): File;

	/**
	 * Reads the contents of the file, starting at the current position.
	 * Returns a string that contains up to the specified number of characters. If a number of characters is not supplied, reads from the current position to the end of the file. If the file is encoded, multiple bytes might be read to create single Unicode characters.
	 * @param chars An integer specifying the number of characters to read.
	 */
    read(chars?: number): string;

	/**
	 * Reads a single text character from the file at the current position.
	 * Line feeds are recognized as CR, LF, CRLF or LFCR pairs.If the file is encoded, multiple bytes might be read to create a single Unicode character. Returns a string that contains the character.
	 */
    readch(): string;

	/**
	 * Reads a single line of text from the file at the current position.
	 * Line feeds are recognized as CR, LF, CRLF or LFCR pairs.. If the file is encoded, multiple bytes might be read to create single Unicode characters. Returns a string that contains the text.
	 */
    readln(): string;

	/**
	 * Deletes the file associated with this object from disk immediately, without moving it to the system trash.
	 * Does not resolve aliases; instead, deletes the referenced alias or shortcut file itself. Returns true if the file was successfully removed.
	 * IMPORTANT: Cannot be undone. It is recommended that you prompt the user for permission before deleting.
	 */
    remove(): boolean;

	/**
	 * Renames the associated file.
	 * Does not resolve aliases, but renames the referenced alias or shortcut file itself. Returns true if the file was successfully renamed.
	 * @param newName The new file name, with no path information.
	 */
    rename(newName: string): boolean;

	/**
	 * Attempts to resolve the file-system alias or shortcut that this object refers to.
	 * If successful, creates and returns a new File object that points to the resolved file system element. Returns null if this object does not refer to an alias, or if the alias could not be resolved.
	 */
    resolve(): File;

	/**
	 * Opens a dialog so the user can select a file name to save to.
	 * Opens the built-in platform-specific file-browsing dialog in which a user can select an existing file location to which to save information, and creates a new File object to represent the selected file location.
	 * If the user clicks OK, returns a File object for the selected file location.
	 * If the user cancels, returns null.
	 * @param prompt The prompt text, displayed if the dialog allows a prompt.
	 * @param filter In Windows only, a filter that limits the types of files displayed in the dialog. In Windows only,a filter expression such as "Javascript files:*.jsx;All files:*.*". Not used In Mac OS.
	 */
    static saveDialog(prompt: string, filter?: any): File;

	/**
	 * Opens the built-in platform-specific file-browsing dialog, in which the user can select an existing file location to which to save information, and creates a new File object to represent the selected file.
	 * Differs from the class method saveDialog() in that it presets the current folder to this File object’s parent folder and the file to this object’s associated file.
	 * If the user clicks OK, returns a File object for the selected file.
	 * If the user cancels, returns null.
	 * @param prompt A string containing the prompt text, if the dialog allows a prompt.
	 * @param filter In Windows only, a filter that limits the types of files displayed in the dialog. In Windows only,a filter expression such as "Javascript files:*.jsx;All files:*.*". Not used In Mac OS.
	 */
    saveDlg(prompt: string, filter?: any): File;

	/**
	 * Seeks to a given position in the file.
	 * The new position cannot be less than 0 or greater than the current file size. Returns true if the position was changed.
	 * @param pos The new current position in the file as an offset in bytes from the start, current position, or end, depending on the mode.
	 * @param mode The seek mode. One of: 0: Seek to absolute position, where pos=0 is the first byte of the file. This is the default. 1: Seek relative to the current position. 2. Seek backward from the end of the file.
	 */
    seek(pos: number, mode?: number): boolean;

	/**
	 * Retrieves the current position as a byte offset from the start of the file.
	 * Returns a number, the position index.
	 */
    tell(): number;

	/**
	 * Creates and returns a serialized string representation of this object.
	 * Pass the resulting string to eval() to recreate the object.
	 */
    toSource(): string;

	/**
	 * Converts this object to a string.
	 */
    toString(): string;

	/**
	 * Writes the specified text to the file at the current position.
	 * You can supply multiple text values; the strings are concatenated to form a single string.For encoded files, writing a single Unicode character may write multiple bytes. Returns true if the write was successful.IMPORTANT: Be careful not to write to a file that is open in another application or object, as this can overwrite existing data.
	 * @param text A text string to be written.
	 */
    write(text: string): boolean;

	/**
	 * Writes a string to the file at the current position and appends a line-feed sequence.
	 * You can supply multiple text values. The strings are concatenated into a single string, which is written in the file followed by one line-feed sequence, of the style specified by this object's linefeed property.For encoded files, writing a single Unicode character may write multiple bytes.Returns true if the write was successful.IMPORTANT: Be careful not to write to a file that is open in another application or object, as this can overwrite existing data.
	 * @param text A text string to be written.
	 */
    writeln(text: string): boolean;

}

/**
 * Represents a file-system folder or directory in a platform-independent manner.
 */
declare class Folder {
	/**
	 * The full path name for the referenced folder in URI notation.
	 */
    readonly absoluteURI: string;

	/**
	 * When true, the object refers to a file system alias or shortcut.
	 */
    readonly alias: boolean;

	/**
	 * The folder containing the application data for all users.
	 * In Windows, the value of %APPDATA% (by default, C:\\Documents and Settings\\All Users\\Application Data)
	 * In Mac OS, /Library/Application Support
	 */
    static readonly appData: Folder;

	/**
	 * In Mac OS, a Folder object for the folder containing the bundle of the running application.
	 */
    static readonly appPackage: Folder;

	/**
	 * A Folder object for the folder containing common files for all programs installed by the user.
	 * In Windows, the value of %CommonProgramFiles% (by default, C:\\Program Files\\Common Files)
	 * In Mac OS, /Library/Application Support
	 */
    static readonly commonFiles: Folder;

	/**
	 * The creation date of the referenced folder, or null if the object does not refer to a folder on disk.
	 */
    readonly created: Date;

	/**
	 * A Folder object for the current folder.
	 * Assign a Folder object or a string containing the new path name to set the current folder. This is a class property accessed through the Folder constructor.
	 */
    static current: Folder;

	/**
	 * A Folder object for the folder that contains the user’s desktop.
	 * In Windows, C:\\Documents and Settings\\username\\Desktop
	 * In Mac OS, ~/Desktop
	 */
    static readonly desktop: Folder;

	/**
	 * The localized name portion of the absolute URI for the referenced folder, without the path specification.
	 */
    readonly displayName: string;

	/**
	 * A message describing the most recent file system error.
	 * Typically set by the file system, but a script can set it. Setting this value clears any error message and resets the error bit for opened files. Contains the empty string if there is no error.
	 */
    error: string;

	/**
	 * When true, this object refers to a folder that currently exists in the file system.
	 */
    readonly exists: boolean;

	/**
	 * The name of the current file system.
	 * One of "Windows", "Macintosh", or "Unix".
	 */
    static readonly fs: string;

	/**
	 * The platform-specific name of the referenced folder as a full path name.
	 */
    readonly fsName: string;

	/**
	 * The full path name for the referenced folder in URI notation. .
	 */
    readonly fullName: string;

	/**
	 * The date of the referenced folder's last modification, or null if the object does not refer to a folder on disk.
	 */
    readonly modified: Date;

	/**
	 * A folder pointing to the user's My Documents folder.
	 * In Windows, C:\\Documents and Settings\\username\\My Documents
	 * In Mac OS,~/Documents
	 */
    static readonly myDocuments: Folder;

	/**
	 * The folder name portion of the absolute URI for the referenced file, without the path specification.
	 */
    readonly name: string;

	/**
	 * TThe Folder object for the folder that contains this folder, or null if this object refers to the root folder of a volume.
	 */
    readonly parent: Folder;

	/**
	 * The path portion of the object absolute URI for the referenced file, without the folder name.
	 */
    readonly path: string;

	/**
	 * The path name for the referenced folder in URI notation, relative to the current folder.
	 */
    readonly relativeURI: string;

	/**
	 * A Folder object for the folder containing the executable image of the running application.
	 */
    static readonly startup: Folder;

	/**
	 * A Folder object for the folder containing the operating system files.
	 * In Windows, the value of %windir% (by default, C:\\Windows)
	 * In Mac OS, /System
	 */
    static readonly system: Folder;

	/**
	 * A Folder object for the default folder for temporary files.
	 */
    static readonly temp: Folder;

	/**
	 * A Folder object for the folder containing deleted items. On Windows, the trash folder is a virtual
	 * folder containing a database; therefore, the property value is null on Windows.
	 */
    static readonly trash: Folder;

	/**
	 * A Folder object for the folder containing the user's application data.
	 * In Windows, the value of %USERDATA% (by default, C:\\Documents and Settings\\username\\Application Data)
	 * In Mac OS,~/Library/Application Support.
	 */
    static readonly userData: Folder;

	/**
	 * Creates and returns a new Folder object referring to a given file-system location.
	 * If the path name refers to an already existing disk file, a File object is returned instead.Returns the new Folder object.
	 * @param path The absolute or relative path to the folder associated with this object, specified in URI format. The value stored in the object is the absolute path.The path need not refer to an existing folder. If the path refers to an existing file, rather than a folder: The Folder() function returns a File object instead of a Folder object. The new operator returns a Folder object for a nonexisting folder with the same name.
	 */
    constructor(path?: string);

	/**
	 * Changes the path specification of the referenced folder.
	 * @param path A string containing the new path, absolute or relative to the current folder.
	 */
    changePath(path: string): boolean;

	/**
	 * Creates a folder at the location given by this object's path property.
	 * Returns true if the folder was created.
	 */
    create(): boolean;

	/**
	 * Decodes a UTF-8 encoded string as required by RFC 2396, and returns the decoded string.
	 * See also String.decodeURI().
	 * @param uri The UTF-8 string to decode.
	 */
    static decode(uri: string): string;

	/**
	 * Encodes a string as required by RFC 2396, and returns the encoded string.
	 * All special characters are encoded in UTF-8 and stored as escaped characters starting with the percent sign followed by two hexadecimal digits. For example, the string "my file" is encoded as "my%20file".
	 * Special characters are those with a numeric value greater than 127, except the following: / - _ . ! ~ * ' ( )
	 * See also encodeURI().
	 * @param name The string to encode.
	 */
    static encode(name: string): string;

	/**
	 * Opens this folder in the platform-specific file browser (as if it had been double-clicked in the file browser).
	 * Returns true immediately if the folder was opened successfully.
	 */
    execute(): boolean;

	/**
	 * Retrieves the contents of this folder, filtered by the supplied mask.
	 * Returns an array of File and Folder objects, or null if this object's referenced folder does not exist.
	 * @param mask A search mask for file names, specified as a string or a function. A mask string can contain question mark (?) and asterisk (*) wild cards. Default is "*", which matches all file names. Can also be the name of a function that takes a File or Folder object as its argument. It is called for each file or folder found in the search; if it returns true, the object is added to the return array. NOTE: In Windows, all aliases end with the extension .lnk. ExtendScript strips this from the file name when found, in order to preserve compatibility with other operating systems. You can search for all aliases by supplying the search mask "*.lnk", but note that such code is not portable.
	 */
    getFiles(mask: any): Array<File>;

	/**
	 * Retrieves and returns the path for this file, relative to the specified base path, in URI notation.
	 * If no base path is supplied, the URI is relative to the path of the current folder.Returns a string containing the relative URI.
	 * @param basePath A base path in URI notation.
	 */
    getRelativeURI(basePath?: string): string;

	/**
	 * Reports whether a given encoding is available.
	 * @param name The encoding name. Typical values are "ASCII", "binary", or "UTF-8".For a complete list of supported encodings, see the JavaScript Tools Guide.
	 */
    static isEncodingAvailable(name: string): boolean;

	/**
	 * Deletes the folder associated with this object from disk immediately, without moving it to the system trash.
	 * Folders must be empty before they can be deleted. Does not resolve aliases; instead, deletes the referenced alias or shortcut file itself. Returns true if the file was successfully removed.
	 * IMPORTANT: Cannot be undone. It is recommended that you prompt the user for permission before deleting.
	 */
    remove(): boolean;

	/**
	 * Renames the associated folder.
	 * Does not resolve aliases, but renames the referenced alias or shortcut file itself. Returns true if the folder was successfully renamed.
	 * @param newName The new folder name, with no path information.
	 */
    rename(newName: string): boolean;

	/**
	 * Attempts to resolve the file-system alias or shortcut that this object refers to.
	 * If successful, creates and returns a new Folder object that points to the resolved file system element. Returns null if this object does not refer to an alias, or if the alias could not be resolved.
	 */
    resolve(): Folder;

	/**
	 * Opens the built-in platform-specific file-browsing dialog, and creates a new File or Folder object for the selected file or folder.
	 * Differs from the object method selectDlg() in that it does not preselect a folder.
	 * If the user clicks OK, returns a File or Folder object for the selected file or folder.
	 * If the user cancels, returns null.
	 * @param prompt The prompt text, if the dialog allows a prompt.
	 */
    static selectDialog(prompt: string): Folder;

	/**
	 * Opens the built-in platform-specific file-browsing dialog, and creates a new File or Folder object for the selected file or folder.
	 * Differs from the class method selectDialog() in that it preselects this folder.
	 * If the user clicks OK, returns a File or Folder object for the selected file or folder.
	 * If the user cancels, returns null.
	 * @param prompt The prompt text, if the dialog allows a prompt.
	 */
    selectDlg(prompt: string): Folder;

	/**
	 * Creates and returns a serialized string representation of this object.
	 * Pass the resulting string to eval() to recreate the object.
	 */
    toSource(): string;

	/**
	 * Converts this object to a string.
	 */
    toString(): string;

}

/**
 * Displays an alert box
 * @param message The text to display
 * @param title The title of the alert; ignored on the Macintosh
 * @param errorIcon Display an Error icon; ignored on the Macintosh
 */
declare function alert(message: string, title?: string, errorIcon?: boolean): void;

/**
 * Displays an alert box with Yes and No buttons; returns true for Yes
 * @param message The text to display
 * @param noAsDefault Set to true to set the No button as the default button
 * @param title The title of the alert; ignored on the Macintosh
 */
declare function confirm(message: string, noAsDefault: boolean, title?: string): boolean;
/**
 * Wraps XML into an object.
 */
declare class XML extends Object {
    // TODO: Fill this in.
}