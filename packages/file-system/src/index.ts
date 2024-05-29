export type IoType = PlusIo['PRIVATE_WWW'] | PlusIo['PRIVATE_DOC'] | PlusIo['PUBLIC_DOCUMENTS'] | PlusIo['PUBLIC_DOWNLOADS'];
export type IoResponse = {
  flag: boolean;
  fileEntry?: PlusIoFileEntry | null;
  fileContent?: string;
};
export class UniFileSystem {
  static accessFile(filePath: string, type: IoType = plus.io.PRIVATE_DOC, create: boolean = false): Promise<IoResponse> {
    return new Promise((resolve) => {
      plus.io.requestFileSystem(type, (fs: PlusIoFileSystem) => {
        const dirEntry: PlusIoDirectoryEntry | undefined = fs.root;
        if (dirEntry) {
          dirEntry.getFile(
            filePath,
            { create },
            (fileEntry: PlusIoFileEntry) => resolve({ flag: true, fileEntry }),
            () => resolve({ flag: false })
          );
        } else {
          resolve({ flag: false });
        }
      });
    });
  }
  static readFile(filePath: string, type: IoType = plus.io.PRIVATE_DOC): Promise<IoResponse> {
    return new Promise(async (resolve) => {
      const { flag, fileEntry } = await this.accessFile(filePath, type);
      if (flag && fileEntry) {
        fileEntry.file(
          (file: PlusIoFile) => {
            const fileReader: PlusIoFileReader = new plus.io.FileReader();
            fileReader.readAsText(file, 'utf-8');
            fileReader.onloadend = (e: PlusIoFileEvent) => {
              const dirEntry: PlusIoDirectoryEntry | undefined = e.target;
              if (dirEntry) {
                const fileContent = fileReader.result;
                resolve({ flag: true, fileContent, fileEntry });
              } else {
                resolve({ flag: false });
              }
            };
          },
          () => resolve({ flag: false })
        );
      } else {
        resolve({ flag: false });
      }
    });
  }

  static writeFile(filePath: string, content: string, type: IoType = plus.io.PRIVATE_DOC): Promise<IoResponse> {
    return new Promise(async (resolve) => {
      const { flag, fileContent, fileEntry } = await this.readFile(filePath, type);
      // file exist
      if (flag) {
        const newContent: string = [fileContent ?? '', content].join('\n');
        fileEntry?.createWriter(
          (writer: PlusIoFileWriter) => {
            writer.write(newContent);
            resolve({ flag: true, fileEntry, fileContent: newContent });
          },
          () => resolve({ flag: false })
        );
      }
      // first write
      else {
        const { flag, fileEntry } = await this.accessFile(filePath, type, true);
        if (flag) {
          fileEntry?.createWriter(
            (writer: PlusIoFileWriter) => {
              writer.write(content);
              resolve({ flag: true, fileEntry, fileContent: content });
            },
            () => resolve({ flag: false })
          );
        }
      }
    });
  }
}

export default UniFileSystem;
